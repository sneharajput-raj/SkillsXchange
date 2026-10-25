package com.skillswap.repository;

import com.skillswap.entity.CreditTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CreditTransactionRepository extends JpaRepository<CreditTransaction, Long> {
    Page<CreditTransaction> findByWalletIdOrderByCreatedAtDesc(Long walletId, Pageable pageable);
}
