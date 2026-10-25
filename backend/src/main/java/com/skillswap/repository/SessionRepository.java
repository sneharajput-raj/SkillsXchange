package com.skillswap.repository;

import com.skillswap.entity.Session;
import com.skillswap.entity.SessionStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM Session s WHERE s.id = :id")
    Optional<Session> findByIdWithLock(@Param("id") Long id);

    Optional<Session> findBySwapRequestId(Long swapRequestId);

    @Query("SELECT s FROM Session s WHERE s.learner.id = :userId OR s.teacher.id = :userId ORDER BY s.scheduledDate DESC, s.startTime DESC")
    Page<Session> findUserSessions(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT s FROM Session s WHERE (s.learner.id = :userId OR s.teacher.id = :userId) AND s.status = :status")
    List<Session> findUserSessionsByStatus(@Param("userId") Long userId, @Param("status") SessionStatus status);

    @Query("SELECT COUNT(s) > 0 FROM Session s WHERE (s.learner.id = :userId OR s.teacher.id = :userId) " +
           "AND s.scheduledDate = :date AND s.status = 'SCHEDULED' " +
           "AND ((s.startTime < :endTime AND s.endTime > :startTime))")
    boolean existsConflictingSession(@Param("userId") Long userId,
                                    @Param("date") LocalDate date,
                                    @Param("startTime") LocalTime startTime,
                                    @Param("endTime") LocalTime endTime);

    long countByStatus(SessionStatus status);
}
