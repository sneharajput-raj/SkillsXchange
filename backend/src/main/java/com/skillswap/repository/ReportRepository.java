package com.skillswap.repository;

import com.skillswap.entity.Report;
import com.skillswap.entity.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    Page<Report> findByStatusOrderByCreatedAtDesc(ReportStatus status, Pageable pageable);
    List<Report> findByReportedUserId(Long reportedUserId);
    long countByStatus(ReportStatus status);
}
