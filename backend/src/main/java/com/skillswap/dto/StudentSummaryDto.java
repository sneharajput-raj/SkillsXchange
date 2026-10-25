package com.skillswap.dto;

import java.math.BigDecimal;
import java.util.List;

public class StudentSummaryDto {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String departmentName;
    private Integer graduationYear;
    private String headline;
    private String city;
    private String country;
    private String occupation;
    private String avatarUrl;
    private BigDecimal averageRating;
    private int totalReviewsCount;
    private int totalSessionsCompleted;
    private List<String> teachSkills;
    private List<String> learnSkills;

    public StudentSummaryDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public Integer getGraduationYear() { return graduationYear; }
    public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public BigDecimal getAverageRating() { return averageRating; }
    public void setAverageRating(BigDecimal averageRating) { this.averageRating = averageRating; }

    public int getTotalReviewsCount() { return totalReviewsCount; }
    public void setTotalReviewsCount(int totalReviewsCount) { this.totalReviewsCount = totalReviewsCount; }

    public int getTotalSessionsCompleted() { return totalSessionsCompleted; }
    public void setTotalSessionsCompleted(int totalSessionsCompleted) { this.totalSessionsCompleted = totalSessionsCompleted; }

    public List<String> getTeachSkills() { return teachSkills; }
    public void setTeachSkills(List<String> teachSkills) { this.teachSkills = teachSkills; }

    public List<String> getLearnSkills() { return learnSkills; }
    public void setLearnSkills(List<String> learnSkills) { this.learnSkills = learnSkills; }
}
