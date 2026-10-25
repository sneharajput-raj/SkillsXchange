package com.skillswap.service;

import com.skillswap.dto.ReviewDto;
import com.skillswap.dto.SubmitReviewRequest;
import com.skillswap.entity.Review;
import com.skillswap.entity.Session;
import com.skillswap.entity.SessionStatus;
import com.skillswap.entity.StudentProfile;
import com.skillswap.entity.User;
import com.skillswap.exception.DuplicateResourceException;
import com.skillswap.exception.InvalidSwapStateException;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.repository.ReviewRepository;
import com.skillswap.repository.SessionRepository;
import com.skillswap.repository.StudentProfileRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         SessionRepository sessionRepository,
                         UserRepository userRepository,
                         StudentProfileRepository studentProfileRepository) {
        this.reviewRepository = reviewRepository;
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
    }

    @Transactional
    public ReviewDto submitReview(Long reviewerId, Long sessionId, SubmitReviewRequest request) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with id: " + sessionId));

        if (session.getStatus() != SessionStatus.COMPLETED) {
            throw new InvalidSwapStateException("Cannot review a session that is not COMPLETED. Current status: " + session.getStatus());
        }

        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer user not found with id: " + reviewerId));

        User learner = session.getLearner();
        User teacher = session.getTeacher();

        User reviewee;
        if (reviewer.getId().equals(learner.getId())) {
            reviewee = teacher;
        } else if (reviewer.getId().equals(teacher.getId())) {
            reviewee = learner;
        } else {
            throw new InvalidSwapStateException("Only session participants can submit a review");
        }

        if (reviewRepository.existsBySessionIdAndReviewerId(sessionId, reviewerId)) {
            throw new DuplicateResourceException("You have already submitted a review for this session");
        }

        Review review = new Review();
        review.setSession(session);
        review.setReviewer(reviewer);
        review.setReviewee(reviewee);
        review.setRating(request.getRating());
        review.setFeedback(request.getFeedback());
        review.setEndorsementTags(request.getEndorsementTags());
        review.setCreatedAt(Instant.now());

        Review saved = reviewRepository.save(review);

        // Update student profile stats
        studentProfileRepository.findByUserId(reviewee.getId()).ifPresent(profile -> {
            Double avg = reviewRepository.calculateAverageRatingForUser(reviewee.getId());
            long count = reviewRepository.countByRevieweeId(reviewee.getId());
            if (avg != null) {
                profile.setAverageRating(BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP));
            }
            profile.setTotalReviewsCount((int) count);
            studentProfileRepository.save(profile);
        });

        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public Page<ReviewDto> getReviewsForUser(Long userId, Pageable pageable) {
        return reviewRepository.findByRevieweeIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::mapToDto);
    }

    private ReviewDto mapToDto(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setId(review.getId());
        dto.setSessionId(review.getSession().getId());
        dto.setReviewerId(review.getReviewer().getId());
        dto.setReviewerName(review.getReviewer().getFullName());
        dto.setRevieweeId(review.getReviewee().getId());
        dto.setRevieweeName(review.getReviewee().getFullName());
        dto.setRating(review.getRating());
        dto.setFeedback(review.getFeedback());
        dto.setEndorsementTags(review.getEndorsementTags());
        dto.setCreatedAt(review.getCreatedAt());

        studentProfileRepository.findByUserId(review.getReviewer().getId())
                .ifPresent(profile -> dto.setReviewerAvatarUrl(profile.getAvatarUrl()));

        return dto;
    }
}
