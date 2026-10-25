package com.skillswap.dto;

import java.util.List;

public class AdminAnalyticsDto {
    private long totalStudents;
    private long totalSessionsCompleted;
    private long totalActiveSwaps;
    private long openDisputesCount;
    private double sessionCompletionRate;
    private List<SkillDemandSupplyItem> topDemandedSkills;
    private List<SkillDemandSupplyItem> topTaughtSkills;
    private List<SkillDemandSupplyItem> deficitSkills;

    public AdminAnalyticsDto() {}

    public static class SkillDemandSupplyItem {
        private String skillName;
        private long demandCount;
        private long supplyCount;
        private long deficit;

        public SkillDemandSupplyItem() {}

        public SkillDemandSupplyItem(String skillName, long demandCount, long supplyCount) {
            this.skillName = skillName;
            this.demandCount = demandCount;
            this.supplyCount = supplyCount;
            this.deficit = demandCount - supplyCount;
        }

        public String getSkillName() { return skillName; }
        public void setSkillName(String skillName) { this.skillName = skillName; }
        public long getDemandCount() { return demandCount; }
        public void setDemandCount(long demandCount) { this.demandCount = demandCount; }
        public long getSupplyCount() { return supplyCount; }
        public void setSupplyCount(long supplyCount) { this.supplyCount = supplyCount; }
        public long getDeficit() { return deficit; }
        public void setDeficit(long deficit) { this.deficit = deficit; }
    }

    // Getters and Setters
    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }
    public long getTotalSessionsCompleted() { return totalSessionsCompleted; }
    public void setTotalSessionsCompleted(long totalSessionsCompleted) { this.totalSessionsCompleted = totalSessionsCompleted; }
    public long getTotalActiveSwaps() { return totalActiveSwaps; }
    public void setTotalActiveSwaps(long totalActiveSwaps) { this.totalActiveSwaps = totalActiveSwaps; }
    public long getOpenDisputesCount() { return openDisputesCount; }
    public void setOpenDisputesCount(long openDisputesCount) { this.openDisputesCount = openDisputesCount; }
    public double getSessionCompletionRate() { return sessionCompletionRate; }
    public void setSessionCompletionRate(double sessionCompletionRate) { this.sessionCompletionRate = sessionCompletionRate; }
    public List<SkillDemandSupplyItem> getTopDemandedSkills() { return topDemandedSkills; }
    public void setTopDemandedSkills(List<SkillDemandSupplyItem> topDemandedSkills) { this.topDemandedSkills = topDemandedSkills; }
    public List<SkillDemandSupplyItem> getTopTaughtSkills() { return topTaughtSkills; }
    public void setTopTaughtSkills(List<SkillDemandSupplyItem> topTaughtSkills) { this.topTaughtSkills = topTaughtSkills; }
    public List<SkillDemandSupplyItem> getDeficitSkills() { return deficitSkills; }
    public void setDeficitSkills(List<SkillDemandSupplyItem> deficitSkills) { this.deficitSkills = deficitSkills; }
}
