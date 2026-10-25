package com.skillswap.dto;

import java.math.BigDecimal;
import java.util.List;

public class MatchScoreDto {
    private Long studentId;
    private Long userId;
    private String fullName;
    private String avatarUrl;
    private String departmentName;
    private int matchScore; // 0 to 100
    private boolean isDirectMutualSwap;
    private List<String> teachSkills;
    private List<String> wantsToLearn;
    private BigDecimal averageRating;
    private int totalReviews;
    private MatchExplanation breakdown;

    public MatchScoreDto() {}

    public static class MatchExplanation {
        private FactorItem mutualSkillMatch;
        private FactorItem proficiencyCompatibility;
        private FactorItem availabilityOverlap;
        private FactorItem ratingScore;
        private FactorItem preferenceAlignment;

        public MatchExplanation() {}

        public MatchExplanation(FactorItem mutualSkillMatch, FactorItem proficiencyCompatibility, FactorItem availabilityOverlap, FactorItem ratingScore, FactorItem preferenceAlignment) {
            this.mutualSkillMatch = mutualSkillMatch;
            this.proficiencyCompatibility = proficiencyCompatibility;
            this.availabilityOverlap = availabilityOverlap;
            this.ratingScore = ratingScore;
            this.preferenceAlignment = preferenceAlignment;
        }

        public FactorItem getMutualSkillMatch() { return mutualSkillMatch; }
        public void setMutualSkillMatch(FactorItem mutualSkillMatch) { this.mutualSkillMatch = mutualSkillMatch; }
        public FactorItem getProficiencyCompatibility() { return proficiencyCompatibility; }
        public void setProficiencyCompatibility(FactorItem proficiencyCompatibility) { this.proficiencyCompatibility = proficiencyCompatibility; }
        public FactorItem getAvailabilityOverlap() { return availabilityOverlap; }
        public void setAvailabilityOverlap(FactorItem availabilityOverlap) { this.availabilityOverlap = availabilityOverlap; }
        public FactorItem getRatingScore() { return ratingScore; }
        public void setRatingScore(FactorItem ratingScore) { this.ratingScore = ratingScore; }
        public FactorItem getPreferenceAlignment() { return preferenceAlignment; }
        public void setPreferenceAlignment(FactorItem preferenceAlignment) { this.preferenceAlignment = preferenceAlignment; }
    }

    public static class FactorItem {
        private int score;
        private int max;
        private String detail;

        public FactorItem() {}
        public FactorItem(int score, int max, String detail) {
            this.score = score; this.max = max; this.detail = detail;
        }
        public int getScore() { return score; }
        public void setScore(int score) { this.score = score; }
        public int getMax() { return max; }
        public void setMax(int max) { this.max = max; }
        public String getDetail() { return detail; }
        public void setDetail(String detail) { this.detail = detail; }
    }

    // Getters and Setters
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public int getMatchScore() { return matchScore; }
    public void setMatchScore(int matchScore) { this.matchScore = matchScore; }
    public boolean isDirectMutualSwap() { return isDirectMutualSwap; }
    public void setDirectMutualSwap(boolean directMutualSwap) { isDirectMutualSwap = directMutualSwap; }
    public List<String> getTeachSkills() { return teachSkills; }
    public void setTeachSkills(List<String> teachSkills) { this.teachSkills = teachSkills; }
    public List<String> getWantsToLearn() { return wantsToLearn; }
    public void setWantsToLearn(List<String> wantsToLearn) { this.wantsToLearn = wantsToLearn; }
    public BigDecimal getAverageRating() { return averageRating; }
    public void setAverageRating(BigDecimal averageRating) { this.averageRating = averageRating; }
    public int getTotalReviews() { return totalReviews; }
    public void setTotalReviews(int totalReviews) { this.totalReviews = totalReviews; }
    public MatchExplanation getBreakdown() { return breakdown; }
    public void setBreakdown(MatchExplanation breakdown) { this.breakdown = breakdown; }
}
