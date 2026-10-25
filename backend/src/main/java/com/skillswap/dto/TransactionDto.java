package com.skillswap.dto;

import com.skillswap.entity.TransactionType;
import java.time.Instant;

public class TransactionDto {
    private Long id;
    private Long referenceSessionId;
    private TransactionType transactionType;
    private int amount;
    private int balanceAfter;
    private String description;
    private Instant createdAt;

    public TransactionDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getReferenceSessionId() { return referenceSessionId; }
    public void setReferenceSessionId(Long referenceSessionId) { this.referenceSessionId = referenceSessionId; }
    public TransactionType getTransactionType() { return transactionType; }
    public void setTransactionType(TransactionType transactionType) { this.transactionType = transactionType; }
    public int getAmount() { return amount; }
    public void setAmount(int amount) { this.amount = amount; }
    public int getBalanceAfter() { return balanceAfter; }
    public void setBalanceAfter(int balanceAfter) { this.balanceAfter = balanceAfter; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
