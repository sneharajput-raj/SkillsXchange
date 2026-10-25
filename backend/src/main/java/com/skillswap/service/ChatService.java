package com.skillswap.service;

import com.skillswap.dto.ConversationDto;
import com.skillswap.dto.MessageDto;
import com.skillswap.dto.SendMessageRequest;
import com.skillswap.entity.Conversation;
import com.skillswap.entity.Message;
import com.skillswap.entity.NotificationEventType;
import com.skillswap.entity.SwapRequest;
import com.skillswap.entity.User;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final SwapRequestRepository swapRequestRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final NotificationService notificationService;

    public ChatService(ConversationRepository conversationRepository,
                       MessageRepository messageRepository,
                       UserRepository userRepository,
                       SwapRequestRepository swapRequestRepository,
                       StudentProfileRepository studentProfileRepository,
                       NotificationService notificationService) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.swapRequestRepository = swapRequestRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public ConversationDto getOrCreateConversation(Long userOneId, Long userTwoId, Long swapRequestId) {
        Conversation conversation = conversationRepository.findConversationBetween(userOneId, userTwoId)
                .orElseGet(() -> {
                    User u1 = userRepository.findById(userOneId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userOneId));
                    User u2 = userRepository.findById(userTwoId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userTwoId));
                    SwapRequest swap = null;
                    if (swapRequestId != null) {
                        swap = swapRequestRepository.findById(swapRequestId).orElse(null);
                    }
                    Conversation c = new Conversation(u1, u2, swap);
                    return conversationRepository.save(c);
                });

        return mapToConversationDto(conversation, userOneId);
    }

    @Transactional(readOnly = true)
    public List<ConversationDto> getUserConversations(Long userId) {
        return conversationRepository.findUserConversations(userId).stream()
                .map(c -> mapToConversationDto(c, userId))
                .collect(Collectors.toList());
    }

    @Transactional
    public Page<MessageDto> getConversationMessages(Long conversationId, Long userId, Pageable pageable) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found: " + conversationId));

        if (!conversation.getUserOne().getId().equals(userId) && !conversation.getUserTwo().getId().equals(userId)) {
            throw new IllegalArgumentException("User is not a participant in this conversation");
        }

        // Mark incoming messages as read
        List<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
        messages.stream()
                .filter(m -> !m.getSender().getId().equals(userId) && !m.isRead())
                .forEach(m -> m.setRead(true));
        messageRepository.saveAll(messages);

        return messageRepository.findByConversationIdOrderByCreatedAtDesc(conversationId, pageable)
                .map(this::mapToMessageDto);
    }

    @Transactional
    public MessageDto sendMessage(Long conversationId, Long senderId, SendMessageRequest request) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found: " + conversationId));

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found: " + senderId));

        if (!conversation.getUserOne().getId().equals(senderId) && !conversation.getUserTwo().getId().equals(senderId)) {
            throw new IllegalArgumentException("User is not a participant in this conversation");
        }

        User recipient = conversation.getUserOne().getId().equals(senderId)
                ? conversation.getUserTwo()
                : conversation.getUserOne();

        Message message = new Message(conversation, sender, request.getContent());
        Message saved = messageRepository.save(message);

        conversation.setUpdatedAt(Instant.now());
        conversationRepository.save(conversation);

        // Notify recipient
        notificationService.sendNotification(
                recipient,
                NotificationEventType.NEW_MESSAGE,
                "New message from " + sender.getFullName(),
                request.getContent().length() > 50 ? request.getContent().substring(0, 50) + "..." : request.getContent(),
                "/messages?conversationId=" + conversation.getId()
        );

        return mapToMessageDto(saved);
    }

    private ConversationDto mapToConversationDto(Conversation conversation, Long currentUserId) {
        User partner = conversation.getUserOne().getId().equals(currentUserId)
                ? conversation.getUserTwo()
                : conversation.getUserOne();

        ConversationDto dto = new ConversationDto();
        dto.setId(conversation.getId());
        dto.setPartnerId(partner.getId());
        dto.setPartnerName(partner.getFullName());
        if (conversation.getSwapRequest() != null) {
            dto.setSwapRequestId(conversation.getSwapRequest().getId());
        }

        studentProfileRepository.findByUserId(partner.getId())
                .ifPresent(profile -> dto.setPartnerAvatarUrl(profile.getAvatarUrl()));

        Page<Message> lastMessagePage = messageRepository.findByConversationIdOrderByCreatedAtDesc(conversation.getId(), PageRequest.of(0, 1));
        if (!lastMessagePage.isEmpty()) {
            Message lastMsg = lastMessagePage.getContent().get(0);
            dto.setLastMessage(lastMsg.getContent());
            dto.setLastMessageTime(lastMsg.getCreatedAt());
        } else {
            dto.setLastMessageTime(conversation.getCreatedAt());
        }

        dto.setUnreadCount(messageRepository.countByConversationIdAndSenderIdNotAndReadFalse(conversation.getId(), currentUserId));
        return dto;
    }

    private MessageDto mapToMessageDto(Message m) {
        MessageDto dto = new MessageDto();
        dto.setId(m.getId());
        dto.setConversationId(m.getConversation().getId());
        dto.setSenderId(m.getSender().getId());
        dto.setSenderName(m.getSender().getFullName());
        dto.setContent(m.getContent());
        dto.setRead(m.isRead());
        dto.setCreatedAt(m.getCreatedAt());
        return dto;
    }
}
