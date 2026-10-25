package com.skillswap.service;

import com.skillswap.dto.ScheduleSessionRequest;
import com.skillswap.dto.SessionSummaryDto;
import com.skillswap.entity.NotificationEventType;
import com.skillswap.entity.Session;
import com.skillswap.entity.SessionStatus;
import com.skillswap.entity.SessionVerificationCode;
import com.skillswap.entity.StudentProfile;
import com.skillswap.entity.SwapRequest;
import com.skillswap.entity.SwapStatus;
import com.skillswap.entity.User;
import com.skillswap.exception.InvalidSwapStateException;
import com.skillswap.exception.InvalidVerificationCodeException;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.repository.ReviewRepository;
import com.skillswap.repository.SessionRepository;
import com.skillswap.repository.SessionVerificationCodeRepository;
import com.skillswap.repository.StudentProfileRepository;
import com.skillswap.repository.SwapRequestRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalTime;
import java.util.Objects;

@Service
public class SessionLifecycleService {

    private final SessionRepository sessionRepository;
    private final SessionVerificationCodeRepository codeRepository;
    private final SwapRequestRepository swapRepository;
    private final StudentProfileRepository profileRepository;
    private final ReviewRepository reviewRepository;
    private final CreditWalletService walletService;
    private final NotificationService notificationService;
    private final PasswordEncoder passwordEncoder;

    public SessionLifecycleService(
            SessionRepository sessionRepository,
            SessionVerificationCodeRepository codeRepository,
            SwapRequestRepository swapRepository,
            StudentProfileRepository profileRepository,
            ReviewRepository reviewRepository,
            CreditWalletService walletService,
            NotificationService notificationService,
            PasswordEncoder passwordEncoder) {
        this.sessionRepository = sessionRepository;
        this.codeRepository = codeRepository;
        this.swapRepository = swapRepository;
        this.profileRepository = profileRepository;
        this.reviewRepository = reviewRepository;
        this.walletService = walletService;
        this.notificationService = notificationService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public SessionSummaryDto scheduleSession(Long currentUserId, ScheduleSessionRequest req) {
        SwapRequest swap = swapRepository.findById(req.getSwapRequestId())
                .orElseThrow(() -> new ResourceNotFoundException("Swap request not found"));

        if (!swap.getSender().getId().equals(currentUserId) && !swap.getReceiver().getId().equals(currentUserId)) {
            throw new AccessDeniedException("You are not a participant in this swap request.");
        }

        if (swap.getStatus() != SwapStatus.ACCEPTED) {
            throw new InvalidSwapStateException("Cannot schedule a session for a swap that is not in ACCEPTED status.");
        }

        if (sessionRepository.findBySwapRequestId(swap.getId()).isPresent()) {
            throw new IllegalStateException("A session has already been scheduled for this swap request.");
        }

        // Sender wanted to learn requestedSkill, so Sender is Learner; Receiver is Teacher
        User learner = swap.getSender();
        User teacher = swap.getReceiver();

        LocalTime startTime = req.getStartTime();
        LocalTime endTime = req.getEndTime() != null ? req.getEndTime() : startTime.plusHours(1);

        Session session = new Session(
                swap, learner, teacher, swap.getRequestedSkill(),
                req.getScheduledDate(), startTime, endTime,
                req.getMode(), req.getVenueOrLink()
        );
        session = sessionRepository.save(session);

        // Deduct 1 credit into Escrow from Learner's wallet
        walletService.holdCreditInEscrow(learner.getId(), session.getId());

        // Generate 6-digit mutual completion OTP
        String plainOtp = String.format("%06d", new SecureRandom().nextInt(1000000));
        SessionVerificationCode code = new SessionVerificationCode(
                session, passwordEncoder.encode(plainOtp), plainOtp, Instant.now().plusSeconds(86400)
        );
        codeRepository.save(code);

        notificationService.createNotification(
                teacher,
                NotificationEventType.SESSION_REMINDER,
                "New Tutoring Session Scheduled",
                "Session with " + learner.getFullName() + " booked for " + req.getScheduledDate() + " at " + startTime,
                "/sessions"
        );

        return toDto(session, currentUserId);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public SessionSummaryDto completeSession(Long sessionId, String verificationCode, Long teacherId) {
        Session session = sessionRepository.findByIdWithLock(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with ID: " + sessionId));

        if (!session.getTeacher().getId().equals(teacherId)) {
            throw new AccessDeniedException("Only the designated mentor/teacher can verify session completion.");
        }

        if (session.getStatus() != SessionStatus.SCHEDULED && session.getStatus() != SessionStatus.IN_PROGRESS) {
            throw new InvalidSwapStateException("Session is not in an active schedule state (Current: " + session.getStatus() + ")");
        }

        SessionVerificationCode code = codeRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Verification code not found for session"));

        if (!passwordEncoder.matches(verificationCode, code.getCodeHash()) && !verificationCode.equals(code.getPlainCodeForLearner())) {
            code.setAttemptCount(code.getAttemptCount() + 1);
            if (code.getAttemptCount() >= 3) {
                session.setStatus(SessionStatus.DISPUTED);
                sessionRepository.save(session);
            }
            codeRepository.save(code);
            throw new InvalidVerificationCodeException("Incorrect 6-digit verification code. Please confirm with your peer.");
        }

        // Transition session state
        session.setStatus(SessionStatus.COMPLETED);
        session.setCompletedAt(Instant.now());
        sessionRepository.save(session);

        // Atomically settle escrowed credit to Teacher
        walletService.transferEscrowToTeacher(session.getLearner().getId(), teacherId, sessionId);

        // Update profile completed sessions count
        profileRepository.findByUserId(session.getTeacher().getId()).ifPresent(p -> {
            p.setTotalSessionsCompleted(p.getTotalSessionsCompleted() + 1);
            profileRepository.save(p);
        });
        profileRepository.findByUserId(session.getLearner().getId()).ifPresent(p -> {
            p.setTotalSessionsCompleted(p.getTotalSessionsCompleted() + 1);
            profileRepository.save(p);
        });

        // Notifications
        notificationService.createNotification(
                session.getTeacher(),
                NotificationEventType.SESSION_COMPLETED,
                "Session Completed! +1 Credit Earned",
                "Your tutoring session with " + session.getLearner().getFullName() + " was completed. 1 Skill Credit added to wallet.",
                "/wallet"
        );
        notificationService.createNotification(
                session.getLearner(),
                NotificationEventType.SESSION_COMPLETED,
                "Session Completed",
                "Session completed with " + session.getTeacher().getFullName() + ". Please submit a review!",
                "/sessions"
        );

        return toDto(session, teacherId);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public SessionSummaryDto cancelSession(Long sessionId, Long currentUserId, String reason) {
        Session session = sessionRepository.findByIdWithLock(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        if (!session.getLearner().getId().equals(currentUserId) && !session.getTeacher().getId().equals(currentUserId)) {
            throw new AccessDeniedException("You are not a participant in this session.");
        }

        if (session.getStatus() != SessionStatus.SCHEDULED) {
            throw new InvalidSwapStateException("Only scheduled sessions can be cancelled.");
        }

        session.setStatus(SessionStatus.CANCELLED);
        session.setCancellationReason(reason);
        sessionRepository.save(session);

        // Refund escrow back to learner
        walletService.refundEscrow(session.getLearner().getId(), sessionId, reason);

        User notifyTarget = session.getLearner().getId().equals(currentUserId) ? session.getTeacher() : session.getLearner();
        notificationService.createNotification(
                notifyTarget,
                NotificationEventType.SESSION_REMINDER,
                "Session Cancelled",
                "Session on " + session.getScheduledDate() + " was cancelled. Reason: " + reason,
                "/sessions"
        );

        return toDto(session, currentUserId);
    }

    @Transactional(readOnly = true)
    public Page<SessionSummaryDto> getUserSessions(Long userId, Pageable pageable) {
        return sessionRepository.findUserSessions(userId, pageable)
                .map(s -> toDto(s, userId));
    }

    private SessionSummaryDto toDto(Session s, Long currentUserId) {
        SessionSummaryDto dto = new SessionSummaryDto();
        dto.setId(s.getId());
        dto.setSwapRequestId(s.getSwapRequest().getId());
        dto.setLearnerId(s.getLearner().getId());
        dto.setLearnerName(s.getLearner().getFullName());
        profileRepository.findByUserId(s.getLearner().getId()).ifPresent(p -> dto.setLearnerAvatarUrl(p.getAvatarUrl()));

        dto.setTeacherId(s.getTeacher().getId());
        dto.setTeacherName(s.getTeacher().getFullName());
        profileRepository.findByUserId(s.getTeacher().getId()).ifPresent(p -> dto.setTeacherAvatarUrl(p.getAvatarUrl()));

        dto.setSkillId(s.getSkill().getId());
        dto.setSkillName(s.getSkill().getName());
        dto.setScheduledDate(s.getScheduledDate());
        dto.setStartTime(s.getStartTime());
        dto.setEndTime(s.getEndTime());
        dto.setDurationMinutes(s.getDurationMinutes());
        dto.setMode(s.getMode());
        dto.setVenueOrLink(s.getVenueOrLink());
        dto.setStatus(s.getStatus());
        dto.setCancellationReason(s.getCancellationReason());
        dto.setScheduledAt(s.getScheduledAt());
        dto.setCompletedAt(s.getCompletedAt());

        // Reveal verification code ONLY to the learner
        if (Objects.equals(s.getLearner().getId(), currentUserId)) {
            codeRepository.findBySessionId(s.getId()).ifPresent(c ->
                    dto.setPlainVerificationCode(c.getPlainCodeForLearner())
            );
        }

        // Reviews check
        dto.setReviewSubmittedByLearner(reviewRepository.existsBySessionIdAndReviewerId(s.getId(), s.getLearner().getId()));
        dto.setReviewSubmittedByTeacher(reviewRepository.existsBySessionIdAndReviewerId(s.getId(), s.getTeacher().getId()));

        return dto;
    }
}
