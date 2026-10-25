package com.skillswap.service;

import com.skillswap.dto.*;
import com.skillswap.entity.*;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final ReportRepository reportRepository;
    private final AdminAuditLogRepository adminAuditLogRepository;
    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;
    private final SwapRequestRepository swapRequestRepository;
    private final SkillRepository skillRepository;
    private final UserLearnSkillRepository userLearnSkillRepository;
    private final UserTeachSkillRepository userTeachSkillRepository;
    private final CreditWalletService creditWalletService;

    public AdminService(ReportRepository reportRepository,
                        AdminAuditLogRepository adminAuditLogRepository,
                        UserRepository userRepository,
                        SessionRepository sessionRepository,
                        SwapRequestRepository swapRequestRepository,
                        SkillRepository skillRepository,
                        UserLearnSkillRepository userLearnSkillRepository,
                        UserTeachSkillRepository userTeachSkillRepository,
                        CreditWalletService creditWalletService) {
        this.reportRepository = reportRepository;
        this.adminAuditLogRepository = adminAuditLogRepository;
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.swapRequestRepository = swapRequestRepository;
        this.skillRepository = skillRepository;
        this.userLearnSkillRepository = userLearnSkillRepository;
        this.userTeachSkillRepository = userTeachSkillRepository;
        this.creditWalletService = creditWalletService;
    }

    @Transactional
    public Report createReport(Long reporterId, CreateReportRequest request) {
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new ResourceNotFoundException("Reporter not found: " + reporterId));
        User reportedUser = userRepository.findById(request.getReportedUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Reported user not found: " + request.getReportedUserId()));

        Report report = new Report(
                reporter,
                reportedUser,
                request.getRelatedSessionId(),
                request.getCategory(),
                request.getDescription()
        );

        return reportRepository.save(report);
    }

    @Transactional(readOnly = true)
    public Page<Report> getReports(ReportStatus status, Pageable pageable) {
        if (status != null) {
            return reportRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
        }
        return reportRepository.findAll(pageable);
    }

    @Transactional
    public Report resolveReport(Long adminId, Long reportId, ResolveReportRequest request, String ipAddress) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found: " + adminId));

        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));

        ReportStatus targetStatus = "DISMISS".equalsIgnoreCase(request.getResolutionAction())
                ? ReportStatus.DISMISSED
                : ReportStatus.RESOLVED;

        report.setStatus(targetStatus);
        report.setAdminNotes(request.getAdminNotes() != null
                ? request.getResolutionAction() + ": " + request.getAdminNotes()
                : request.getResolutionAction());

        Report saved = reportRepository.save(report);

        // If resolution is REFUND_LEARNER and related session has an escrow hold
        if ("REFUND_LEARNER".equalsIgnoreCase(request.getResolutionAction()) && report.getRelatedSessionId() != null) {
            sessionRepository.findById(report.getRelatedSessionId()).ifPresent(s -> {
                if (s.getStatus() == SessionStatus.SCHEDULED || s.getStatus() == SessionStatus.DISPUTED) {
                    creditWalletService.refundSessionEscrow(s.getLearner().getId(), s.getId());
                    s.setStatus(SessionStatus.CANCELLED);
                    sessionRepository.save(s);
                }
            });
        }

        AdminAuditLog log = new AdminAuditLog(
                admin,
                "RESOLVE_REPORT",
                "Report",
                reportId,
                "Action: " + request.getResolutionAction() + ", Notes: " + request.getAdminNotes(),
                ipAddress
        );
        adminAuditLogRepository.save(log);

        return saved;
    }

    @Transactional
    public User updateUserStatus(Long adminId, Long targetUserId, UserStatusUpdateRequest request, String ipAddress) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found: " + adminId));

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Target user not found: " + targetUserId));

        targetUser.setActive(request.getActive());
        User saved = userRepository.save(targetUser);

        AdminAuditLog log = new AdminAuditLog(
                admin,
                request.getActive() ? "ACTIVATE_USER" : "DEACTIVATE_USER",
                "User",
                targetUserId,
                "Reason: " + request.getReason(),
                ipAddress
        );
        adminAuditLogRepository.save(log);

        return saved;
    }

    @Transactional(readOnly = true)
    public AdminAnalyticsDto getAnalytics() {
        AdminAnalyticsDto dto = new AdminAnalyticsDto();

        long totalStudents = userRepository.count();
        long completedSessions = sessionRepository.countByStatus(SessionStatus.COMPLETED);
        long cancelledSessions = sessionRepository.countByStatus(SessionStatus.CANCELLED);
        long activeSwaps = swapRequestRepository.countByStatus(SwapStatus.PENDING) + swapRequestRepository.countByStatus(SwapStatus.ACCEPTED);
        long openDisputes = reportRepository.countByStatus(ReportStatus.OPEN);

        dto.setTotalStudents(totalStudents);
        dto.setTotalSessionsCompleted(completedSessions);
        dto.setTotalActiveSwaps(activeSwaps);
        dto.setOpenDisputesCount(openDisputes);

        long totalConcluded = completedSessions + cancelledSessions;
        double completionRate = totalConcluded > 0 ? ((double) completedSessions / totalConcluded) * 100.0 : 100.0;
        dto.setSessionCompletionRate(Math.round(completionRate * 10.0) / 10.0);

        // Aggregate skills demand and supply
        List<Skill> allSkills = skillRepository.findByApprovedTrue();
        List<AdminAnalyticsDto.SkillDemandSupplyItem> items = new ArrayList<>();

        for (Skill s : allSkills) {
            long demand = userLearnSkillRepository.findAll().stream().filter(ls -> ls.getSkill().getId().equals(s.getId())).count();
            long supply = userTeachSkillRepository.findAll().stream().filter(ts -> ts.getSkill().getId().equals(s.getId())).count();
            items.add(new AdminAnalyticsDto.SkillDemandSupplyItem(s.getName(), demand, supply));
        }

        List<AdminAnalyticsDto.SkillDemandSupplyItem> topDemanded = items.stream()
                .sorted(Comparator.comparingLong(AdminAnalyticsDto.SkillDemandSupplyItem::getDemandCount).reversed())
                .limit(5)
                .collect(Collectors.toList());

        List<AdminAnalyticsDto.SkillDemandSupplyItem> topTaught = items.stream()
                .sorted(Comparator.comparingLong(AdminAnalyticsDto.SkillDemandSupplyItem::getSupplyCount).reversed())
                .limit(5)
                .collect(Collectors.toList());

        List<AdminAnalyticsDto.SkillDemandSupplyItem> deficitSkills = items.stream()
                .sorted(Comparator.comparingLong(AdminAnalyticsDto.SkillDemandSupplyItem::getDeficit).reversed())
                .limit(5)
                .collect(Collectors.toList());

        dto.setTopDemandedSkills(topDemanded);
        dto.setTopTaughtSkills(topTaught);
        dto.setDeficitSkills(deficitSkills);

        return dto;
    }

    @Transactional(readOnly = true)
    public Page<AdminAuditLog> getAuditLogs(Pageable pageable) {
        return adminAuditLogRepository.findAllByOrderByCreatedAtDesc(pageable);
    }
}
