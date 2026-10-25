package com.skillswap.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "credit_transactions", indexes = {
    @Index(name = "idx_txns_wallet_created", columnList = "wallet_id, created_at")
})
public class CreditTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wallet_id", nullable = false)
    private CreditWallet wallet;

    @Column(name = "reference_session_id")
    private Long referenceSessionId;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false)
    private TransactionType transactionType;

    @Column(nullable = false)
    private int amount;

    @Column(name = "balance_after", nullable = false)
    private int balanceAfter;

    @Column(nullable = false)
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public CreditTransaction() {}

    public CreditTransaction(CreditWallet wallet, Long referenceSessionId, TransactionType transactionType, int amount, int balanceAfter, String description) {
        this.wallet = wallet;
        this.referenceSessionId = referenceSessionId;
        this.transactionType = transactionType;
        this.amount = amount;
        this.balanceAfter = balanceAfter;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CreditWallet getWallet() { return wallet; }
    public void setWallet(CreditWallet wallet) { this.wallet = wallet; }

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
