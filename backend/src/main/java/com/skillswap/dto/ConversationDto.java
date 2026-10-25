package com.skillswap.dto;

import java.time.Instant;

public class ConversationDto {
    private Long id;
    private Long partnerId;
    private String partnerName;
    private String partnerAvatarUrl;
    private Long swapRequestId;
    private String lastMessage;
    private Instant lastMessageTime;
    private long unreadCount;

    public ConversationDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getPartnerId() { return partnerId; }
    public void setPartnerId(Long partnerId) { this.partnerId = partnerId; }
    public String getPartnerName() { return partnerName; }
    public void setPartnerName(String partnerName) { this.partnerName = partnerName; }
    public String getPartnerAvatarUrl() { return partnerAvatarUrl; }
    public void setPartnerAvatarUrl(String partnerAvatarUrl) { this.partnerAvatarUrl = partnerAvatarUrl; }
    public Long getSwapRequestId() { return swapRequestId; }
    public void setSwapRequestId(Long swapRequestId) { this.swapRequestId = swapRequestId; }
    public String getLastMessage() { return lastMessage; }
    public void setLastMessage(String lastMessage) { this.lastMessage = lastMessage; }
    public Instant getLastMessageTime() { return lastMessageTime; }
    public void setLastMessageTime(Instant lastMessageTime) { this.lastMessageTime = lastMessageTime; }
    public long getUnreadCount() { return unreadCount; }
    public void setUnreadCount(long unreadCount) { this.unreadCount = unreadCount; }
}
