package com.skillswap.dto;

public class WalletSummaryDto {
    private Long id;
    private Long userId;
    private int balance;
    private int escrowBalance;
    private int totalBalance;
    private int lifetimeEarned;
    private int lifetimeSpent;

    public WalletSummaryDto() {}

    public WalletSummaryDto(Long id, Long userId, int balance, int escrowBalance, int lifetimeEarned, int lifetimeSpent) {
        this.id = id;
        this.userId = userId;
        this.balance = balance;
        this.escrowBalance = escrowBalance;
        this.totalBalance = balance + escrowBalance;
        this.lifetimeEarned = lifetimeEarned;
        this.lifetimeSpent = lifetimeSpent;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public int getBalance() { return balance; }
    public void setBalance(int balance) { this.balance = balance; }
    public int getEscrowBalance() { return escrowBalance; }
    public void setEscrowBalance(int escrowBalance) { this.escrowBalance = escrowBalance; }
    public int getTotalBalance() { return totalBalance; }
    public void setTotalBalance(int totalBalance) { this.totalBalance = totalBalance; }
    public int getLifetimeEarned() { return lifetimeEarned; }
    public void setLifetimeEarned(int lifetimeEarned) { this.lifetimeEarned = lifetimeEarned; }
    public int getLifetimeSpent() { return lifetimeSpent; }
    public void setLifetimeSpent(int lifetimeSpent) { this.lifetimeSpent = lifetimeSpent; }
}
