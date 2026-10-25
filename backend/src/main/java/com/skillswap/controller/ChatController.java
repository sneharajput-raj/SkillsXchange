package com.skillswap.controller;

import com.skillswap.dto.ApiResponse;
import com.skillswap.dto.ConversationDto;
import com.skillswap.dto.MessageDto;
import com.skillswap.dto.SendMessageRequest;
import com.skillswap.security.UserPrincipal;
import com.skillswap.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<List<ConversationDto>>> getConversations(@AuthenticationPrincipal UserPrincipal principal) {
        List<ConversationDto> conversations = chatService.getUserConversations(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Conversations retrieved", conversations));
    }

    @PostMapping("/conversations")
    public ResponseEntity<ApiResponse<ConversationDto>> getOrCreateConversation(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Map<String, Object> body) {
        Long partnerId = Long.valueOf(body.get("partnerId").toString());
        Long swapRequestId = body.get("swapRequestId") != null ? Long.valueOf(body.get("swapRequestId").toString()) : null;

        ConversationDto conversation = chatService.getOrCreateConversation(principal.getId(), partnerId, swapRequestId);
        return ResponseEntity.ok(ApiResponse.success("Conversation initialized", conversation));
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<ApiResponse<Page<MessageDto>>> getMessages(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long conversationId,
            @PageableDefault(size = 30, sort = "createdAt", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<MessageDto> messages = chatService.getConversationMessages(conversationId, principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success("Messages retrieved", messages));
    }

    @PostMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<ApiResponse<MessageDto>> sendMessage(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long conversationId,
            @Valid @RequestBody SendMessageRequest request) {
        MessageDto message = chatService.sendMessage(conversationId, principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Message sent successfully", message));
    }
}
