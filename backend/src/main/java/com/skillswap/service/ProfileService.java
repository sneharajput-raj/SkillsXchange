package com.skillswap.service;

import com.skillswap.dto.AddLearnSkillRequest;
import com.skillswap.dto.AddTeachSkillRequest;
import com.skillswap.dto.SetAvailabilityRequest;
import com.skillswap.dto.StudentProfileDto;
import com.skillswap.dto.StudentSummaryDto;
import com.skillswap.dto.UpdateProfileRequest;
import com.skillswap.entity.Availability;
import com.skillswap.entity.Skill;
import com.skillswap.entity.StudentProfile;
import com.skillswap.entity.User;
import com.skillswap.entity.UserLearnSkill;
import com.skillswap.entity.UserTeachSkill;
import com.skillswap.exception.DuplicateResourceException;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.repository.AvailabilityRepository;
import com.skillswap.repository.SkillRepository;
import com.skillswap.repository.StudentProfileRepository;
import com.skillswap.repository.UserLearnSkillRepository;
import com.skillswap.repository.UserTeachSkillRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfileService {

    private final StudentProfileRepository profileRepository;
    private final UserTeachSkillRepository teachSkillRepository;
    private final UserLearnSkillRepository learnSkillRepository;
    private final AvailabilityRepository availabilityRepository;
    private final SkillRepository skillRepository;

    public ProfileService(
            StudentProfileRepository profileRepository,
            UserTeachSkillRepository teachSkillRepository,
            UserLearnSkillRepository learnSkillRepository,
            AvailabilityRepository availabilityRepository,
            SkillRepository skillRepository) {
        this.profileRepository = profileRepository;
        this.teachSkillRepository = teachSkillRepository;
        this.learnSkillRepository = learnSkillRepository;
        this.availabilityRepository = availabilityRepository;
        this.skillRepository = skillRepository;
    }

    @Transactional(readOnly = true)
    public StudentProfileDto getProfileByUserId(Long userId) {
        StudentProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + userId));

        List<UserTeachSkill> teachSkills = teachSkillRepository.findByUserId(userId);
        List<UserLearnSkill> learnSkills = learnSkillRepository.findByUserId(userId);
        List<Availability> availabilities = availabilityRepository.findByUserId(userId);

        return toFullDto(profile, teachSkills, learnSkills, availabilities);
    }

    @Transactional
    public StudentProfileDto updateProfile(Long userId, UpdateProfileRequest req) {
        StudentProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + userId));

        if (req.getBio() != null) profile.setBio(req.getBio());
        if (req.getAvatarUrl() != null) profile.setAvatarUrl(req.getAvatarUrl());
        if (req.getPortfolioUrl() != null) profile.setPortfolioUrl(req.getPortfolioUrl());
        if (req.getPreferredLearningMode() != null) profile.setPreferredLearningMode(req.getPreferredLearningMode());
        if (req.getGraduationYear() != null) profile.setGraduationYear(req.getGraduationYear());
        if (req.getHeadline() != null) profile.setHeadline(req.getHeadline());
        if (req.getCity() != null) profile.setCity(req.getCity());
        if (req.getCountry() != null) profile.setCountry(req.getCountry());
        if (req.getLanguagesSpoken() != null) profile.setLanguagesSpoken(req.getLanguagesSpoken());
        if (req.getOccupation() != null) profile.setOccupation(req.getOccupation());
        if (req.getOrganization() != null) profile.setOrganization(req.getOrganization());

        profileRepository.save(profile);
        return getProfileByUserId(userId);
    }

    @Transactional
    public void addTeachSkill(Long userId, AddTeachSkillRequest req) {
        if (teachSkillRepository.countByUserId(userId) >= 10) {
            throw new IllegalArgumentException("Maximum of 10 taught skills allowed.");
        }
        if (teachSkillRepository.existsByUserIdAndSkillId(userId, req.getSkillId())) {
            throw new DuplicateResourceException("This skill is already in your teaching inventory.");
        }

        StudentProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
        Skill skill = skillRepository.findById(req.getSkillId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));

        UserTeachSkill uts = new UserTeachSkill(profile.getUser(), skill, req.getProficiencyLevel(), req.getExperienceMonths());
        uts.setProofDescription(req.getProofDescription());
        teachSkillRepository.save(uts);
    }

    @Transactional
    public void deleteTeachSkill(Long userId, Long skillId) {
        teachSkillRepository.deleteByUserIdAndSkillId(userId, skillId);
    }

    @Transactional
    public void addLearnSkill(Long userId, AddLearnSkillRequest req) {
        if (learnSkillRepository.countByUserId(userId) >= 10) {
            throw new IllegalArgumentException("Maximum of 10 learning goals allowed.");
        }
        if (learnSkillRepository.existsByUserIdAndSkillId(userId, req.getSkillId())) {
            throw new DuplicateResourceException("This skill is already in your learning goals.");
        }

        StudentProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
        Skill skill = skillRepository.findById(req.getSkillId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));

        UserLearnSkill uls = new UserLearnSkill(profile.getUser(), skill, req.getTargetProficiencyLevel(), req.getPriority());
        uls.setLearningGoalNotes(req.getLearningGoalNotes());
        learnSkillRepository.save(uls);
    }

    @Transactional
    public void deleteLearnSkill(Long userId, Long skillId) {
        learnSkillRepository.deleteByUserIdAndSkillId(userId, skillId);
    }

    @Transactional
    public void setAvailability(Long userId, SetAvailabilityRequest req) {
        StudentProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
        User user = profile.getUser();

        availabilityRepository.deleteByUserId(userId);

        if (req.getSlots() != null) {
            List<Availability> newSlots = new ArrayList<>();
            for (SetAvailabilityRequest.Slot s : req.getSlots()) {
                if (!s.getStartTime().isBefore(s.getEndTime())) {
                    throw new IllegalArgumentException("Start time must be before end time for slot on " + s.getDayOfWeek());
                }
                newSlots.add(new Availability(user, s.getDayOfWeek(), s.getStartTime(), s.getEndTime()));
            }
            availabilityRepository.saveAll(newSlots);
        }
    }

    @Transactional(readOnly = true)
    public Page<StudentSummaryDto> searchStudents(String query, Long categoryId, Pageable pageable) {
        String normalized = (query == null || query.isBlank()) ? null : query.trim().toLowerCase();
        return profileRepository.searchActiveProfiles(normalized, categoryId, pageable)
                .map(this::toSummaryDto);
    }

    public StudentSummaryDto toSummaryDto(StudentProfile p) {
        StudentSummaryDto dto = new StudentSummaryDto();
        dto.setId(p.getId());
        dto.setUserId(p.getUser().getId());
        dto.setFullName(p.getUser().getFullName());
        dto.setEmail(p.getUser().getEmail());
        dto.setDepartmentName(p.getDepartment() != null ? p.getDepartment().getName() : null);
        dto.setGraduationYear(p.getGraduationYear());
        dto.setHeadline(p.getHeadline());
        dto.setCity(p.getCity());
        dto.setCountry(p.getCountry());
        dto.setOccupation(p.getOccupation());
        dto.setAvatarUrl(p.getAvatarUrl());
        dto.setAverageRating(p.getAverageRating());
        dto.setTotalReviewsCount(p.getTotalReviewsCount());
        dto.setTotalSessionsCompleted(p.getTotalSessionsCompleted());

        List<String> teach = teachSkillRepository.findByUserId(p.getUser().getId()).stream()
                .map(t -> t.getSkill().getName())
                .collect(Collectors.toList());
        dto.setTeachSkills(teach);

        List<String> learn = learnSkillRepository.findByUserId(p.getUser().getId()).stream()
                .map(l -> l.getSkill().getName())
                .collect(Collectors.toList());
        dto.setLearnSkills(learn);

        return dto;
    }

    private StudentProfileDto toFullDto(StudentProfile p, List<UserTeachSkill> teach, List<UserLearnSkill> learn, List<Availability> avail) {
        StudentProfileDto dto = new StudentProfileDto();
        dto.setId(p.getId());
        dto.setUserId(p.getUser().getId());
        dto.setFullName(p.getUser().getFullName());
        dto.setEmail(p.getUser().getEmail());
        if (p.getDepartment() != null) {
            dto.setDepartment(new StudentProfileDto.DepartmentDto(p.getDepartment().getId(), p.getDepartment().getCode(), p.getDepartment().getName()));
        }
        dto.setGraduationYear(p.getGraduationYear());
        dto.setBio(p.getBio());
        dto.setAvatarUrl(p.getAvatarUrl());
        dto.setPortfolioUrl(p.getPortfolioUrl());
        dto.setHeadline(p.getHeadline());
        dto.setCity(p.getCity());
        dto.setCountry(p.getCountry());
        dto.setLanguagesSpoken(p.getLanguagesSpoken());
        dto.setOccupation(p.getOccupation());
        dto.setOrganization(p.getOrganization());
        dto.setPreferredLearningMode(p.getPreferredLearningMode());
        dto.setAverageRating(p.getAverageRating());
        dto.setTotalReviewsCount(p.getTotalReviewsCount());
        dto.setTotalSessionsCompleted(p.getTotalSessionsCompleted());

        dto.setTeachSkills(teach.stream().map(t -> {
            StudentProfileDto.TeachSkillItem item = new StudentProfileDto.TeachSkillItem();
            item.setId(t.getId());
            item.setSkillId(t.getSkill().getId());
            item.setSkillName(t.getSkill().getName());
            item.setCategoryName(t.getSkill().getCategory().getName());
            item.setProficiencyLevel(t.getProficiencyLevel());
            item.setExperienceMonths(t.getExperienceMonths());
            item.setProofDescription(t.getProofDescription());
            return item;
        }).collect(Collectors.toList()));

        dto.setLearnSkills(learn.stream().map(l -> {
            StudentProfileDto.LearnSkillItem item = new StudentProfileDto.LearnSkillItem();
            item.setId(l.getId());
            item.setSkillId(l.getSkill().getId());
            item.setSkillName(l.getSkill().getName());
            item.setCategoryName(l.getSkill().getCategory().getName());
            item.setTargetProficiencyLevel(l.getTargetProficiencyLevel());
            item.setPriority(l.getPriority());
            item.setLearningGoalNotes(l.getLearningGoalNotes());
            return item;
        }).collect(Collectors.toList()));

        dto.setAvailability(avail.stream().map(a ->
                new StudentProfileDto.AvailabilityItem(a.getId(), a.getDayOfWeek(), a.getStartTime(), a.getEndTime())
        ).collect(Collectors.toList()));

        return dto;
    }
}
