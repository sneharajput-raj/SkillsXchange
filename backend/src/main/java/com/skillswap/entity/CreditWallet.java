package com.skillswap.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "credit_wallets")
public class CreditWallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private int balance = 0;

    @Column(name = "escrow_balance", nullable = false)
    private int escrowBalance = 0;

    @Column(name = "lifetime_earned", nullable = false)
    private int lifetimeEarned = 0;

    @Column(name = "lifetime_spent", nullable = false)
    private int lifetimeSpent = 0;

    @Version
    private Long version = 0L;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public CreditWallet() {}

    public CreditWallet(User user, int initialBalance) {
        this.user = user;
        this.balance = initialBalance;
        this.lifetimeEarned = initialBalance;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public int getBalance() { return balance; }
    public void setBalance(int balance) { this.balance = balance; }

    public int getEscrowBalance() { return escrowBalance; }
    public void setEscrowBalance(int escrowBalance) { this.escrowBalance = escrowBalance; }

    public int getLifetimeEarned() { return lifetimeEarned; }
    public void setLifetimeEarned(int lifetimeEarned) { this.lifetimeEarned = lifetimeEarned; }

    public int getLifetimeSpent() { return lifetimeSpent; }
    public void setLifetimeSpent(int lifetimeSpent) { this.lifetimeSpent = lifetimeSpent; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
