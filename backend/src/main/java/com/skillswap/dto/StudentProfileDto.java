package com.skillswap.dto;

import com.skillswap.entity.LearningMode;
import com.skillswap.entity.Priority;
import com.skillswap.entity.ProficiencyLevel;
import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

public class StudentProfileDto {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private DepartmentDto department;
    private Integer graduationYear;
    private String bio;
    private String avatarUrl;
    private String portfolioUrl;
    private String headline;
    private String city;
    private String country;
    private String languagesSpoken;
    private String occupation;
    private String organization;
    private LearningMode preferredLearningMode;
    private BigDecimal averageRating;
    private int totalReviewsCount;
    private int totalSessionsCompleted;
    private List<TeachSkillItem> teachSkills;
    private List<LearnSkillItem> learnSkills;
    private List<AvailabilityItem> availability;

    public StudentProfileDto() {}

    public static class DepartmentDto {
        private Long id;
        private String code;
        private String name;

        public DepartmentDto() {}
        public DepartmentDto(Long id, String code, String name) {
            this.id = id; this.code = code; this.name = name;
        }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    public static class TeachSkillItem {
        private Long id;
        private Long skillId;
        private String skillName;
        private String categoryName;
        private ProficiencyLevel proficiencyLevel;
        private int experienceMonths;
        private String proofDescription;

        public TeachSkillItem() {}
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getSkillId() { return skillId; }
        public void setSkillId(Long skillId) { this.skillId = skillId; }
        public String getSkillName() { return skillName; }
        public void setSkillName(String skillName) { this.skillName = skillName; }
        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
        public ProficiencyLevel getProficiencyLevel() { return proficiencyLevel; }
        public void setProficiencyLevel(ProficiencyLevel proficiencyLevel) { this.proficiencyLevel = proficiencyLevel; }
        public int getExperienceMonths() { return experienceMonths; }
        public void setExperienceMonths(int experienceMonths) { this.experienceMonths = experienceMonths; }
        public String getProofDescription() { return proofDescription; }
        public void setProofDescription(String proofDescription) { this.proofDescription = proofDescription; }
    }

    public static class LearnSkillItem {
        private Long id;
        private Long skillId;
        private String skillName;
        private String categoryName;
        private ProficiencyLevel targetProficiencyLevel;
        private Priority priority;
        private String learningGoalNotes;

        public LearnSkillItem() {}
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getSkillId() { return skillId; }
        public void setSkillId(Long skillId) { this.skillId = skillId; }
        public String getSkillName() { return skillName; }
        public void setSkillName(String skillName) { this.skillName = skillName; }
        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
        public ProficiencyLevel getTargetProficiencyLevel() { return targetProficiencyLevel; }
        public void setTargetProficiencyLevel(ProficiencyLevel targetProficiencyLevel) { this.targetProficiencyLevel = targetProficiencyLevel; }
        public Priority getPriority() { return priority; }
        public void setPriority(Priority priority) { this.priority = priority; }
        public String getLearningGoalNotes() { return learningGoalNotes; }
        public void setLearningGoalNotes(String learningGoalNotes) { this.learningGoalNotes = learningGoalNotes; }
    }

    public static class AvailabilityItem {
        private Long id;
        private DayOfWeek dayOfWeek;
        private LocalTime startTime;
        private LocalTime endTime;

        public AvailabilityItem() {}
        public AvailabilityItem(Long id, DayOfWeek dayOfWeek, LocalTime startTime, LocalTime endTime) {
            this.id = id; this.dayOfWeek = dayOfWeek; this.startTime = startTime; this.endTime = endTime;
        }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public DayOfWeek getDayOfWeek() { return dayOfWeek; }
        public void setDayOfWeek(DayOfWeek dayOfWeek) { this.dayOfWeek = dayOfWeek; }
        public LocalTime getStartTime() { return startTime; }
        public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
        public LocalTime getEndTime() { return endTime; }
        public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public DepartmentDto getDepartment() { return department; }
    public void setDepartment(DepartmentDto department) { this.department = department; }
    public Integer getGraduationYear() { return graduationYear; }
    public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public String getPortfolioUrl() { return portfolioUrl; }
    public void setPortfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; }
    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getLanguagesSpoken() { return languagesSpoken; }
    public void setLanguagesSpoken(String languagesSpoken) { this.languagesSpoken = languagesSpoken; }
    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }
    public String getOrganization() { return organization; }
    public void setOrganization(String organization) { this.organization = organization; }
    public LearningMode getPreferredLearningMode() { return preferredLearningMode; }
    public void setPreferredLearningMode(LearningMode preferredLearningMode) { this.preferredLearningMode = preferredLearningMode; }
    public BigDecimal getAverageRating() { return averageRating; }
    public void setAverageRating(BigDecimal averageRating) { this.averageRating = averageRating; }
    public int getTotalReviewsCount() { return totalReviewsCount; }
    public void setTotalReviewsCount(int totalReviewsCount) { this.totalReviewsCount = totalReviewsCount; }
    public int getTotalSessionsCompleted() { return totalSessionsCompleted; }
    public void setTotalSessionsCompleted(int totalSessionsCompleted) { this.totalSessionsCompleted = totalSessionsCompleted; }
    public List<TeachSkillItem> getTeachSkills() { return teachSkills; }
    public void setTeachSkills(List<TeachSkillItem> teachSkills) { this.teachSkills = teachSkills; }
    public List<LearnSkillItem> getLearnSkills() { return learnSkills; }
    public void setLearnSkills(List<LearnSkillItem> learnSkills) { this.learnSkills = learnSkills; }
    public List<AvailabilityItem> getAvailability() { return availability; }
    public void setAvailability(List<AvailabilityItem> availability) { this.availability = availability; }
}
