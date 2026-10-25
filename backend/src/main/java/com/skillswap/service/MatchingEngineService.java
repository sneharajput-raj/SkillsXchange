package com.skillswap.service;

import com.skillswap.dto.MatchScoreDto;
import com.skillswap.entity.Availability;
import com.skillswap.entity.StudentProfile;
import com.skillswap.entity.UserLearnSkill;
import com.skillswap.entity.UserTeachSkill;
import com.skillswap.repository.AvailabilityRepository;
import com.skillswap.repository.StudentProfileRepository;
import com.skillswap.repository.UserLearnSkillRepository;
import com.skillswap.repository.UserTeachSkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MatchingEngineService {

    private final StudentProfileRepository profileRepository;
    private final UserTeachSkillRepository teachSkillRepository;
    private final UserLearnSkillRepository learnSkillRepository;
    private final AvailabilityRepository availabilityRepository;

    public MatchingEngineService(
            StudentProfileRepository profileRepository,
            UserTeachSkillRepository teachSkillRepository,
            UserLearnSkillRepository learnSkillRepository,
            AvailabilityRepository availabilityRepository) {
        this.profileRepository = profileRepository;
        this.teachSkillRepository = teachSkillRepository;
        this.learnSkillRepository = learnSkillRepository;
        this.availabilityRepository = availabilityRepository;
    }

    @Transactional(readOnly = true)
    public List<MatchScoreDto> findMatchesForStudent(Long studentUserId) {
        StudentProfile myProfile = profileRepository.findByUserId(studentUserId).orElse(null);
        if (myProfile == null) return List.of();

        List<UserTeachSkill> myTeachSkills = teachSkillRepository.findByUserId(studentUserId);
        List<UserLearnSkill> myLearnSkills = learnSkillRepository.findByUserId(studentUserId);
        List<Availability> myAvailability = availabilityRepository.findByUserId(studentUserId);

        Set<Long> myLearnSkillIds = myLearnSkills.stream().map(l -> l.getSkill().getId()).collect(Collectors.toSet());
        Set<Long> myTeachSkillIds = myTeachSkills.stream().map(t -> t.getSkill().getId()).collect(Collectors.toSet());

        List<StudentProfile> candidateProfiles = profileRepository.findActiveProfilesExcluding(studentUserId);
        List<MatchScoreDto> matches = new ArrayList<>();

        for (StudentProfile candidate : candidateProfiles) {
            Long candidateUserId = candidate.getUser().getId();
            List<UserTeachSkill> candidateTeach = teachSkillRepository.findByUserId(candidateUserId);
            List<UserLearnSkill> candidateLearn = learnSkillRepository.findByUserId(candidateUserId);
            List<Availability> candidateAvail = availabilityRepository.findByUserId(candidateUserId);

            Set<Long> candidateTeachSkillIds = candidateTeach.stream().map(t -> t.getSkill().getId()).collect(Collectors.toSet());
            Set<Long> candidateLearnSkillIds = candidateLearn.stream().map(l -> l.getSkill().getId()).collect(Collectors.toSet());

            boolean forwardMatch = candidateTeachSkillIds.stream().anyMatch(myLearnSkillIds::contains);
            boolean reverseMatch = myTeachSkillIds.stream().anyMatch(candidateLearnSkillIds::contains);

            if (!forwardMatch && !reverseMatch) {
                continue; // No skill overlap
            }

            MatchScoreDto dto = calculateMatchScore(
                    myProfile, candidate,
                    myTeachSkills, myLearnSkills, myAvailability,
                    candidateTeach, candidateLearn, candidateAvail,
                    forwardMatch, reverseMatch
            );

            if (dto.getMatchScore() >= 30) {
                matches.add(dto);
            }
        }

        matches.sort(Comparator.comparingInt(MatchScoreDto::getMatchScore).reversed());
        return matches;
    }

    @Transactional(readOnly = true)
    public MatchScoreDto getMatchExplanation(Long studentUserId, Long targetUserId) {
        StudentProfile myProfile = profileRepository.findByUserId(studentUserId).orElse(null);
        StudentProfile candidate = profileRepository.findByUserId(targetUserId).orElse(null);
        if (myProfile == null || candidate == null) return null;

        List<UserTeachSkill> myTeach = teachSkillRepository.findByUserId(studentUserId);
        List<UserLearnSkill> myLearn = learnSkillRepository.findByUserId(studentUserId);
        List<Availability> myAvail = availabilityRepository.findByUserId(studentUserId);

        List<UserTeachSkill> candTeach = teachSkillRepository.findByUserId(targetUserId);
        List<UserLearnSkill> candLearn = learnSkillRepository.findByUserId(targetUserId);
        List<Availability> candAvail = availabilityRepository.findByUserId(targetUserId);

        Set<Long> myLearnSkillIds = myLearn.stream().map(l -> l.getSkill().getId()).collect(Collectors.toSet());
        Set<Long> myTeachSkillIds = myTeach.stream().map(t -> t.getSkill().getId()).collect(Collectors.toSet());
        Set<Long> candTeachSkillIds = candTeach.stream().map(t -> t.getSkill().getId()).collect(Collectors.toSet());
        Set<Long> candLearnSkillIds = candLearn.stream().map(l -> l.getSkill().getId()).collect(Collectors.toSet());

        boolean forward = candTeachSkillIds.stream().anyMatch(myLearnSkillIds::contains);
        boolean reverse = myTeachSkillIds.stream().anyMatch(candLearnSkillIds::contains);

        return calculateMatchScore(myProfile, candidate, myTeach, myLearn, myAvail, candTeach, candLearn, candAvail, forward, reverse);
    }

    private MatchScoreDto calculateMatchScore(
            StudentProfile learner, StudentProfile tutor,
            List<UserTeachSkill> learnerTeach, List<UserLearnSkill> learnerLearn, List<Availability> learnerAvail,
            List<UserTeachSkill> tutorTeach, List<UserLearnSkill> tutorLearn, List<Availability> tutorAvail,
            boolean forwardMatch, boolean reverseMatch) {

        // Factor 1: Mutual Skill Compatibility (Max 40 pts)
        int mutualScore;
        String mutualDetail;
        if (forwardMatch && reverseMatch) {
            mutualScore = 40;
            mutualDetail = "Direct Mutual Swap: You teach what they want, and they teach what you want.";
        } else if (forwardMatch) {
            mutualScore = 20;
            mutualDetail = "Credit Swap: They teach a skill you want to learn.";
        } else {
            mutualScore = 15;
            mutualDetail = "Credit Swap: You can teach a skill they desire.";
        }

        // Factor 2: Proficiency Level Alignment (Max 20 pts)
        int profScore = 18;
        String profDetail = "Good skill level alignment.";
        for (UserLearnSkill l : learnerLearn) {
            for (UserTeachSkill t : tutorTeach) {
                if (Objects.equals(l.getSkill().getId(), t.getSkill().getId())) {
                    int tutorLvl = t.getProficiencyLevel().getLevel();
                    int targetLvl = l.getTargetProficiencyLevel().getLevel();
                    if (tutorLvl > targetLvl) {
                        profScore = 20;
                        profDetail = "Tutor's expertise (" + t.getProficiencyLevel() + ") exceeds your target (" + l.getTargetProficiencyLevel() + ").";
                    } else if (tutorLvl == targetLvl) {
                        profScore = 18;
                        profDetail = "Tutor's expertise matches your target proficiency level.";
                    } else if (tutorLvl == targetLvl - 1) {
                        profScore = 10;
                        profDetail = "Peer learner: Tutor is slightly below target but qualified for foundational guidance.";
                    } else {
                        profScore = 5;
                        profDetail = "Proficiency gap detected.";
                    }
                    break;
                }
            }
        }

        // Factor 3: Availability Overlap (Max 20 pts)
        int overlapCount = 0;
        for (Availability la : learnerAvail) {
            for (Availability ta : tutorAvail) {
                if (la.getDayOfWeek() == ta.getDayOfWeek()) {
                    if (la.getStartTime().isBefore(ta.getEndTime()) && la.getEndTime().isAfter(ta.getStartTime())) {
                        overlapCount++;
                    }
                }
            }
        }

        int availScore;
        String availDetail;
        if (overlapCount >= 3) {
            availScore = 20;
            availDetail = overlapCount + " overlapping time windows found across the week.";
        } else if (overlapCount == 2) {
            availScore = 15;
            availDetail = "2 overlapping time slots available.";
        } else if (overlapCount == 1) {
            availScore = 10;
            availDetail = "1 overlapping time slot found.";
        } else {
            availScore = 0;
            availDetail = "No overlapping recurring slots found. Schedule can be coordinated via chat.";
        }

        // Factor 4: Historical Peer Reputation (Max 10 pts)
        int repScore;
        String repDetail;
        if (tutor.getTotalReviewsCount() == 0) {
            repScore = 8;
            repDetail = "New mentor baseline score (8/10).";
        } else {
            repScore = Math.min(10, (int) Math.round(tutor.getAverageRating().doubleValue() * 2.0));
            repDetail = tutor.getAverageRating() + " star rating across " + tutor.getTotalReviewsCount() + " peer reviews.";
        }

// Factor 5: Learning Mode Compatibility (Max 10 pts).
        int modeScore = 2;
        if (learner.getPreferredLearningMode() == tutor.getPreferredLearningMode() ||
                learner.getPreferredLearningMode() == com.skillswap.entity.LearningMode.HYBRID ||
                tutor.getPreferredLearningMode() == com.skillswap.entity.LearningMode.HYBRID) {
            modeScore = 6;
        }

        int proxScore = modeScore;
        String proxDetail = "Learning mode compatibility.";

        int totalScore = Math.min(100, mutualScore + profScore + availScore + repScore + proxScore);

        MatchScoreDto dto = new MatchScoreDto();
        dto.setStudentId(tutor.getId());
        dto.setUserId(tutor.getUser().getId());
        dto.setFullName(tutor.getUser().getFullName());
        dto.setAvatarUrl(tutor.getAvatarUrl());
        dto.setDepartmentName(tutor.getDepartment() != null ? tutor.getDepartment().getName() : "General");
        dto.setMatchScore(totalScore);
        dto.setDirectMutualSwap(forwardMatch && reverseMatch);
        dto.setTeachSkills(tutorTeach.stream().map(t -> t.getSkill().getName()).collect(Collectors.toList()));
        dto.setWantsToLearn(tutorLearn.stream().map(l -> l.getSkill().getName()).collect(Collectors.toList()));
        dto.setAverageRating(tutor.getAverageRating());
        dto.setTotalReviews(tutor.getTotalReviewsCount());

        MatchScoreDto.MatchExplanation breakdown = new MatchScoreDto.MatchExplanation(
                new MatchScoreDto.FactorItem(mutualScore, 40, mutualDetail),
                new MatchScoreDto.FactorItem(profScore, 20, profDetail),
                new MatchScoreDto.FactorItem(availScore, 20, availDetail),
                new MatchScoreDto.FactorItem(repScore, 10, repDetail),
                new MatchScoreDto.FactorItem(proxScore, 10, proxDetail)
        );
        dto.setBreakdown(breakdown);

        return dto;
    }
}
