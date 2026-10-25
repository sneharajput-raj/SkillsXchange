package com.skillswap.service;

import com.skillswap.dto.TransactionDto;
import com.skillswap.dto.WalletSummaryDto;
import com.skillswap.entity.CreditTransaction;
import com.skillswap.entity.CreditWallet;
import com.skillswap.entity.TransactionType;
import com.skillswap.entity.User;
import com.skillswap.exception.InsufficientCreditsException;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.repository.CreditTransactionRepository;
import com.skillswap.repository.CreditWalletRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CreditWalletService {

    private final CreditWalletRepository walletRepository;
    private final CreditTransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public CreditWalletService(CreditWalletRepository walletRepository, CreditTransactionRepository transactionRepository, UserRepository userRepository) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CreditWallet getOrCreateWallet(Long userId) {
        return walletRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
            CreditWallet wallet = new CreditWallet(user, 3);
            wallet = walletRepository.save(wallet);

            CreditTransaction txn = new CreditTransaction(
                    wallet, null, TransactionType.SIGNUP_BONUS, 3, 3, "Initial signup credit grant"
            );
            transactionRepository.save(txn);
            return wallet;
        });
    }

    @Transactional(readOnly = true)
    public WalletSummaryDto getWalletSummary(Long userId) {
        CreditWallet wallet = getOrCreateWallet(userId);
        return new WalletSummaryDto(
                wallet.getId(),
                userId,
                wallet.getBalance(),
                wallet.getEscrowBalance(),
                wallet.getLifetimeEarned(),
                wallet.getLifetimeSpent()
        );
    }

    @Transactional(readOnly = true)
    public Page<TransactionDto> getTransactions(Long userId, Pageable pageable) {
        CreditWallet wallet = getOrCreateWallet(userId);
        return transactionRepository.findByWalletIdOrderByCreatedAtDesc(wallet.getId(), pageable)
                .map(this::toDto);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void holdCreditInEscrow(Long learnerId, Long sessionId) {
        CreditWallet wallet = walletRepository.findByUserIdWithLock(learnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user: " + learnerId));

        if (wallet.getBalance() < 1) {
            throw new InsufficientCreditsException("Insufficient available credits. You have " + wallet.getBalance() + " credits, but 1 credit is required to schedule this session.");
        }

        wallet.setBalance(wallet.getBalance() - 1);
        wallet.setEscrowBalance(wallet.getEscrowBalance() + 1);
        walletRepository.save(wallet);

        CreditTransaction txn = new CreditTransaction(
                wallet, sessionId, TransactionType.ESCROW_HOLD, -1, wallet.getBalance(),
                "1 Credit held in escrow for scheduled session #" + sessionId
        );
        transactionRepository.save(txn);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void transferEscrowToTeacher(Long learnerId, Long teacherId, Long sessionId) {
        CreditWallet learnerWallet = walletRepository.findByUserIdWithLock(learnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Learner wallet not found"));

        CreditWallet teacherWallet = walletRepository.findByUserIdWithLock(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher wallet not found"));

        if (learnerWallet.getEscrowBalance() < 1) {
            throw new InsufficientCreditsException("No escrowed credits found for session settlement.");
        }

        // Deduct from learner escrow
        learnerWallet.setEscrowBalance(learnerWallet.getEscrowBalance() - 1);
        learnerWallet.setLifetimeSpent(learnerWallet.getLifetimeSpent() + 1);
        walletRepository.save(learnerWallet);

        CreditTransaction learnerTxn = new CreditTransaction(
                learnerWallet, sessionId, TransactionType.SESSION_SPENT, -1, learnerWallet.getBalance(),
                "Completed session #" + sessionId + " (Settled to mentor)"
        );
        transactionRepository.save(learnerTxn);

        // Add to teacher available
        teacherWallet.setBalance(teacherWallet.getBalance() + 1);
        teacherWallet.setLifetimeEarned(teacherWallet.getLifetimeEarned() + 1);
        walletRepository.save(teacherWallet);

        CreditTransaction teacherTxn = new CreditTransaction(
                teacherWallet, sessionId, TransactionType.SESSION_EARNED, 1, teacherWallet.getBalance(),
                "Earned 1 Skill Credit for tutoring session #" + sessionId
        );
        transactionRepository.save(teacherTxn);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void refundEscrow(Long learnerId, Long sessionId, String reason) {
        CreditWallet learnerWallet = walletRepository.findByUserIdWithLock(learnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Learner wallet not found"));

        if (learnerWallet.getEscrowBalance() >= 1) {
            learnerWallet.setEscrowBalance(learnerWallet.getEscrowBalance() - 1);
            learnerWallet.setBalance(learnerWallet.getBalance() + 1);
            walletRepository.save(learnerWallet);

            CreditTransaction txn = new CreditTransaction(
                    learnerWallet, sessionId, TransactionType.ESCROW_RELEASE, 1, learnerWallet.getBalance(),
                    "Refund of escrowed credit for session #" + sessionId + " (" + reason + ")"
            );
            transactionRepository.save(txn);
        }
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void refundSessionEscrow(Long learnerId, Long sessionId) {
        CreditWallet learnerWallet = walletRepository.findByUserIdWithLock(learnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Learner wallet not found"));

        if (learnerWallet.getEscrowBalance() >= 1) {
            learnerWallet.setEscrowBalance(learnerWallet.getEscrowBalance() - 1);
            learnerWallet.setBalance(learnerWallet.getBalance() + 1);
            walletRepository.save(learnerWallet);

            CreditTransaction txn = new CreditTransaction(
                    learnerWallet, sessionId, TransactionType.ESCROW_RELEASE, 1, learnerWallet.getBalance(),
                    "Refund of escrowed credit for session #" + sessionId
            );
            transactionRepository.save(txn);
        }
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void adminAdjustCredits(Long targetUserId, int amount, String description) {
        CreditWallet wallet = walletRepository.findByUserIdWithLock(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        int newBalance = wallet.getBalance() + amount;
        if (newBalance < 0) {
            throw new IllegalArgumentException("Adjustment would cause a negative balance");
        }

        wallet.setBalance(newBalance);
        if (amount > 0) {
            wallet.setLifetimeEarned(wallet.getLifetimeEarned() + amount);
        }
        walletRepository.save(wallet);

        CreditTransaction txn = new CreditTransaction(
                wallet, null, TransactionType.ADMIN_ADJUSTMENT, amount, newBalance, description
        );
        transactionRepository.save(txn);
    }

    private TransactionDto toDto(CreditTransaction t) {
        TransactionDto dto = new TransactionDto();
        dto.setId(t.getId());
        dto.setReferenceSessionId(t.getReferenceSessionId());
        dto.setTransactionType(t.getTransactionType());
        dto.setAmount(t.getAmount());
        dto.setBalanceAfter(t.getBalanceAfter());
        dto.setDescription(t.getDescription());
        dto.setCreatedAt(t.getCreatedAt());
        return dto;
    }
}
