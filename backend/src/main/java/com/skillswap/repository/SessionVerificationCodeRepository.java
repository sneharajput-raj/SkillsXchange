package com.skillswap.repository;

import com.skillswap.entity.SessionVerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SessionVerificationCodeRepository extends JpaRepository<SessionVerificationCode, Long> {
    Optional<SessionVerificationCode> findBySessionId(Long sessionId);
}
