package com.skillswap.dto;

import com.skillswap.entity.LearningMode;

public class UpdateProfileRequest {
    private String bio;
    private String avatarUrl;
    private String portfolioUrl;
    private LearningMode preferredLearningMode;
    private Integer graduationYear;
    // Universal profile attributes — all optional, no institution required.
    private String city;
    private String country;
    private String languagesSpoken;
    private String occupation;
    private String organization;
    private String headline;

    public UpdateProfileRequest() {}

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getPortfolioUrl() { return portfolioUrl; }
    public void setPortfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; }

    public LearningMode getPreferredLearningMode() { return preferredLearningMode; }
    public void setPreferredLearningMode(LearningMode preferredLearningMode) { this.preferredLearningMode = preferredLearningMode; }

    public Integer getGraduationYear() { return graduationYear; }
    public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }

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

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }
}
