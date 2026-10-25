package com.skillswap.repository;

import com.skillswap.entity.StudentProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long>, JpaSpecificationExecutor<StudentProfile> {
    Optional<StudentProfile> findByUserId(Long userId);

    @Query("SELECT p FROM StudentProfile p WHERE p.user.id <> :excludeUserId AND p.user.active = true AND p.user.verified = true")
    List<StudentProfile> findActiveProfilesExcluding(@Param("excludeUserId") Long excludeUserId);

    @Query("SELECT p FROM StudentProfile p WHERE p.user.active = true AND p.user.verified = true")
    Page<StudentProfile> findAllActiveProfiles(Pageable pageable);

    @Query(value = """
        SELECT DISTINCT p FROM StudentProfile p
        INNER JOIN p.user u
        LEFT JOIN UserTeachSkill ts ON ts.user.id = u.id
        LEFT JOIN UserLearnSkill ls ON ls.user.id = u.id
        WHERE u.active = true AND u.verified = true
        AND (:query IS NULL OR LOWER(u.fullName) LIKE CONCAT('%', :query, '%') OR LOWER(u.email) LIKE CONCAT('%', :query, '%') OR LOWER(ts.skill.name) LIKE CONCAT('%', :query, '%') OR LOWER(ls.skill.name) LIKE CONCAT('%', :query, '%'))
        AND (:categoryId IS NULL OR ts.skill.category.id = :categoryId OR ls.skill.category.id = :categoryId)
        """,
            countQuery = """
        SELECT COUNT(DISTINCT p.id) FROM StudentProfile p
        INNER JOIN p.user u
        LEFT JOIN UserTeachSkill ts ON ts.user.id = u.id
        LEFT JOIN UserLearnSkill ls ON ls.user.id = u.id
        WHERE u.active = true AND u.verified = true
        AND (:query IS NULL OR LOWER(u.fullName) LIKE CONCAT('%', :query, '%') OR LOWER(u.email) LIKE CONCAT('%', :query, '%') OR LOWER(ts.skill.name) LIKE CONCAT('%', :query, '%') OR LOWER(ls.skill.name) LIKE CONCAT('%', :query, '%'))
        AND (:categoryId IS NULL OR ts.skill.category.id = :categoryId OR ls.skill.category.id = :categoryId)
        """)
    Page<StudentProfile> searchActiveProfiles(
            @Param("query") String query,
            @Param("categoryId") Long categoryId,
            Pageable pageable);
}
