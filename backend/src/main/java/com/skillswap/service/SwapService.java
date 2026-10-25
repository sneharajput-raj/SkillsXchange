package com.skillswap.service;

import com.skillswap.dto.CreateSwapProposalRequest;
import com.skillswap.dto.SwapRequestDto;
import com.skillswap.entity.NotificationEventType;
import com.skillswap.entity.Skill;
import com.skillswap.entity.SwapRequest;
import com.skillswap.entity.SwapStatus;
import com.skillswap.entity.User;
import com.skillswap.exception.DuplicateResourceException;
import com.skillswap.exception.InsufficientCreditsException;
import com.skillswap.exception.InvalidSwapStateException;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.repository.SkillRepository;
import com.skillswap.repository.StudentProfileRepository;
import com.skillswap.repository.SwapRequestRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SwapService {

    private final SwapRequestRepository swapRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final StudentProfileRepository profileRepository;
    private final CreditWalletService walletService;
    private final NotificationService notificationService;

    public SwapService(
            SwapRequestRepository swapRepository,
            UserRepository userRepository,
            SkillRepository skillRepository,
            StudentProfileRepository profileRepository,
            CreditWalletService walletService,
            NotificationService notificationService) {
        this.swapRepository = swapRepository;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.profileRepository = profileRepository;
        this.walletService = walletService;
        this.notificationService = notificationService;
    }

    @Transactional
    public SwapRequestDto createSwapProposal(Long senderId, CreateSwapProposalRequest req) {
        if (senderId.equals(req.getReceiverId())) {
            throw new IllegalArgumentException("You cannot send a swap request to yourself.");
        }

        if (swapRepository.existsPendingSwapBetween(senderId, req.getReceiverId())) {
            throw new DuplicateResourceException("A pending swap request already exists with this student.");
        }

        // If it's a pure credit-backed swap (offeredSkillId == null), verify learner has >= 1 available credit
        if (req.getOfferedSkillId() == null) {
            int balance = walletService.getWalletSummary(senderId).getBalance();
            if (balance < 1) {
                throw new InsufficientCreditsException("You need at least 1 Skill Credit to propose a credit-backed swap.");
            }
        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender user not found"));
        User receiver = userRepository.findById(req.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver student not found"));

        Skill requestedSkill = skillRepository.findById(req.getRequestedSkillId())
                .orElseThrow(() -> new ResourceNotFoundException("Requested skill not found"));

        Skill offeredSkill = null;
        if (req.getOfferedSkillId() != null) {
            offeredSkill = skillRepository.findById(req.getOfferedSkillId())
                    .orElseThrow(() -> new ResourceNotFoundException("Offered skill not found"));
        }

        SwapRequest swap = new SwapRequest(sender, receiver, offeredSkill, requestedSkill, req.getProposedMode(), req.getMessage());
        swap = swapRepository.save(swap);

        notificationService.createNotification(
                receiver,
                NotificationEventType.SWAP_RECEIVED,
                "New Swap Request",
                sender.getFullName() + " wants to learn " + requestedSkill.getName() + " with you.",
                "/swaps"
        );

        return toDto(swap);
    }

    @Transactional
    public SwapRequestDto acceptSwap(Long swapId, Long currentUserId) {
        SwapRequest swap = swapRepository.findById(swapId)
                .orElseThrow(() -> new ResourceNotFoundException("Swap request not found"));

        if (!swap.getReceiver().getId().equals(currentUserId)) {
            throw new AccessDeniedException("Only the recipient can accept this swap request.");
        }

        if (swap.getStatus() != SwapStatus.PENDING) {
            throw new InvalidSwapStateException("This swap request is no longer pending.");
        }

        swap.setStatus(SwapStatus.ACCEPTED);
        swapRepository.save(swap);

        notificationService.createNotification(
                swap.getSender(),
                NotificationEventType.SWAP_ACCEPTED,
                "Swap Request Accepted!",
                swap.getReceiver().getFullName() + " accepted your swap request. You can now schedule a session.",
                "/sessions"
        );

        return toDto(swap);
    }

    @Transactional
    public SwapRequestDto rejectSwap(Long swapId, Long currentUserId, String reason) {
        SwapRequest swap = swapRepository.findById(swapId)
                .orElseThrow(() -> new ResourceNotFoundException("Swap request not found"));

        if (!swap.getReceiver().getId().equals(currentUserId)) {
            throw new AccessDeniedException("Only the recipient can decline this swap request.");
        }

        if (swap.getStatus() != SwapStatus.PENDING) {
            throw new InvalidSwapStateException("This swap request is no longer pending.");
        }

        swap.setStatus(SwapStatus.REJECTED);
        swap.setRejectionReason(reason);
        swapRepository.save(swap);

        notificationService.createNotification(
                swap.getSender(),
                NotificationEventType.SWAP_REJECTED,
                "Swap Request Declined",
                swap.getReceiver().getFullName() + " declined your swap request.",
                "/swaps"
        );

        return toDto(swap);
    }

    @Transactional
    public SwapRequestDto cancelSwap(Long swapId, Long currentUserId) {
        SwapRequest swap = swapRepository.findById(swapId)
                .orElseThrow(() -> new ResourceNotFoundException("Swap request not found"));

        if (!swap.getSender().getId().equals(currentUserId)) {
            throw new AccessDeniedException("Only the sender can cancel this swap request.");
        }

        if (swap.getStatus() != SwapStatus.PENDING) {
            throw new InvalidSwapStateException("Only pending requests can be cancelled.");
        }

        swap.setStatus(SwapStatus.CANCELLED);
        swapRepository.save(swap);

        return toDto(swap);
    }

    @Transactional(readOnly = true)
    public Page<SwapRequestDto> getIncomingSwaps(Long userId, Pageable pageable) {
        return swapRepository.findByReceiverId(userId, pageable).map(this::toDto);
    }

    @Transactional(readOnly = true)
    public Page<SwapRequestDto> getOutgoingSwaps(Long userId, Pageable pageable) {
        return swapRepository.findBySenderId(userId, pageable).map(this::toDto);
    }

    private SwapRequestDto toDto(SwapRequest s) {
        SwapRequestDto dto = new SwapRequestDto();
        dto.setId(s.getId());
        dto.setSenderId(s.getSender().getId());
        dto.setSenderName(s.getSender().getFullName());
        profileRepository.findByUserId(s.getSender().getId()).ifPresent(p -> dto.setSenderAvatarUrl(p.getAvatarUrl()));

        dto.setReceiverId(s.getReceiver().getId());
        dto.setReceiverName(s.getReceiver().getFullName());
        profileRepository.findByUserId(s.getReceiver().getId()).ifPresent(p -> dto.setReceiverAvatarUrl(p.getAvatarUrl()));

        if (s.getOfferedSkill() != null) {
            dto.setOfferedSkillId(s.getOfferedSkill().getId());
            dto.setOfferedSkillName(s.getOfferedSkill().getName());
        }
        dto.setRequestedSkillId(s.getRequestedSkill().getId());
        dto.setRequestedSkillName(s.getRequestedSkill().getName());

        dto.setStatus(s.getStatus());
        dto.setProposedMode(s.getProposedMode());
        dto.setMessage(s.getMessage());
        dto.setRejectionReason(s.getRejectionReason());
        dto.setExpiresAt(s.getExpiresAt());
        dto.setCreatedAt(s.getCreatedAt());
        return dto;
    }
}
