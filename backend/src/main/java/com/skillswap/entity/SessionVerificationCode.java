package com.skillswap.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "session_verification_codes")
public class SessionVerificationCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false, unique = true)
    private Session session;

    @Column(name = "code_hash", nullable = false)
    private String codeHash;

    @Column(name = "plain_code_for_learner", length = 10)
    private String plainCodeForLearner;

    @Column(name = "attempt_count", nullable = false)
    private int attemptCount = 0;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    public SessionVerificationCode() {}

    public SessionVerificationCode(Session session, String codeHash, String plainCodeForLearner, Instant expiresAt) {
        this.session = session;
        this.codeHash = codeHash;
        this.plainCodeForLearner = plainCodeForLearner;
        this.expiresAt = expiresAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Session getSession() { return session; }
    public void setSession(Session session) { this.session = session; }

    public String getCodeHash() { return codeHash; }
    public void setCodeHash(String codeHash) { this.codeHash = codeHash; }

    public String getPlainCodeForLearner() { return plainCodeForLearner; }
    public void setPlainCodeForLearner(String plainCodeForLearner) { this.plainCodeForLearner = plainCodeForLearner; }

    public int getAttemptCount() { return attemptCount; }
    public void setAttemptCount(int attemptCount) { this.attemptCount = attemptCount; }

    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
}
