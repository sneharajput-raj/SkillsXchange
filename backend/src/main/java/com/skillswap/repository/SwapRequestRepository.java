package com.skillswap.repository;

import com.skillswap.entity.SwapRequest;
import com.skillswap.entity.SwapStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SwapRequestRepository extends JpaRepository<SwapRequest, Long> {
    Page<SwapRequest> findByReceiverId(Long receiverId, Pageable pageable);
    Page<SwapRequest> findBySenderId(Long senderId, Pageable pageable);

    List<SwapRequest> findByReceiverIdAndStatus(Long receiverId, SwapStatus status);
    List<SwapRequest> findBySenderIdAndStatus(Long senderId, SwapStatus status);

    long countByStatus(SwapStatus status);

    @Query("SELECT s FROM SwapRequest s WHERE (s.sender.id = :u1 AND s.receiver.id = :u2) OR (s.sender.id = :u2 AND s.receiver.id = :u1)")
    List<SwapRequest> findSwapsBetweenUsers(@Param("u1") Long u1, @Param("u2") Long u2);

    @Query("SELECT COUNT(s) > 0 FROM SwapRequest s WHERE s.sender.id = :senderId AND s.receiver.id = :receiverId AND s.status = 'PENDING'")
    boolean existsPendingSwapBetween(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);
}
