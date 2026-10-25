package com.skillswap.config;

import com.skillswap.entity.*;
import com.skillswap.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;
    private final SkillCategoryRepository skillCategoryRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final CreditWalletRepository creditWalletRepository;
    private final UserTeachSkillRepository userTeachSkillRepository;
    private final UserLearnSkillRepository userLearnSkillRepository;
    private final AvailabilityRepository availabilityRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(DepartmentRepository departmentRepository,
                           SkillCategoryRepository skillCategoryRepository,
                           SkillRepository skillRepository,
                           UserRepository userRepository,
                           StudentProfileRepository studentProfileRepository,
                           CreditWalletRepository creditWalletRepository,
                           UserTeachSkillRepository userTeachSkillRepository,
                           UserLearnSkillRepository userLearnSkillRepository,
                           AvailabilityRepository availabilityRepository,
                           PasswordEncoder passwordEncoder) {
        this.departmentRepository = departmentRepository;
        this.skillCategoryRepository = skillCategoryRepository;
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.creditWalletRepository = creditWalletRepository;
        this.userTeachSkillRepository = userTeachSkillRepository;
        this.userLearnSkillRepository = userLearnSkillRepository;
        this.availabilityRepository = availabilityRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedDepartments();
        seedCategoriesAndSkills();
        seedUsers();
    }

    private void seedDepartments() {
        if (departmentRepository.count() == 0) {
            departmentRepository.save(new Department("CSE", "Computer Science & Engineering"));
            departmentRepository.save(new Department("ECE", "Electronics & Communication Engineering"));
            departmentRepository.save(new Department("MECH", "Mechanical Engineering"));
            departmentRepository.save(new Department("MBA", "School of Management"));
            departmentRepository.save(new Department("DES", "Department of Design & Arts"));
        }
    }

    private void seedCategoriesAndSkills() {
        if (skillCategoryRepository.count() == 0) {
            SkillCategory tech = skillCategoryRepository.save(new SkillCategory("Tech & Programming", "Software engineering, web dev, AI, databases", "code"));
            SkillCategory design = skillCategoryRepository.save(new SkillCategory("Design & Creative", "UI/UX, 3D modelling, graphic design, video editing", "palette"));
            SkillCategory lang = skillCategoryRepository.save(new SkillCategory("Languages", "Foreign language speaking and writing skills", "globe"));
            SkillCategory music = skillCategoryRepository.save(new SkillCategory("Music & Arts", "Instruments, vocal training, painting", "music"));
            SkillCategory academic = skillCategoryRepository.save(new SkillCategory("Academics & Science", "Math, statistics, physics, research writing", "book-open"));

            skillRepository.save(new Skill(tech, "Java & Spring Boot", "Backend enterprise web services and architecture"));
            skillRepository.save(new Skill(tech, "React & JavaScript", "Modern component-based web development"));
            skillRepository.save(new Skill(tech, "Python & Data Science", "Data analysis, scripting, and automation"));
            skillRepository.save(new Skill(tech, "Data Structures & Algorithms", "Problem solving, Big-O analysis, coding interviews"));
            skillRepository.save(new Skill(tech, "Machine Learning", "Model training, scikit-learn, neural networks"));

            skillRepository.save(new Skill(design, "Figma UI/UX Design", "Wireframing, interactive prototyping, user research"));
            skillRepository.save(new Skill(design, "Graphic Design (Photoshop)", "Branding, visual hierarchy, posters"));
            skillRepository.save(new Skill(design, "3D Modeling (Blender)", "3D asset creation and rendering"));

            skillRepository.save(new Skill(lang, "Conversational Spanish", "Everyday vocabulary, pronunciation, grammar"));
            skillRepository.save(new Skill(lang, "French for Beginners", "Basic conversation and phonetics"));
            skillRepository.save(new Skill(lang, "German Language (A1/A2)", "Grammar rules and sentence construction"));

            skillRepository.save(new Skill(music, "Acoustic Guitar", "Fingerpicking, open chords, song rhythm"));
            skillRepository.save(new Skill(music, "Keyboard & Piano", "Scales, chord progressions, sight reading"));

            skillRepository.save(new Skill(academic, "Linear Algebra & Calculus", "Vector spaces, matrices, differentiation"));
            skillRepository.save(new Skill(academic, "Probability & Statistics", "Hypothesis testing, distributions, regression"));
        }
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            Department csDept = departmentRepository.findByCode("CSE").orElse(null);
            Department desDept = departmentRepository.findByCode("DES").orElse(null);

            // 1. Admin
            User admin = new User(
                    "admin@example.com",
                    passwordEncoder.encode("Password@123"),
                    "SkillSwap Administrator",
                    Role.ROLE_ADMIN
            );
            admin.setVerified(true);
            admin.setActive(false);
            userRepository.save(admin);

            // 2. Rohan Sharma (Student 1 - CSE)
            User rohan = new User(
                    "rohan@example.com",
                    passwordEncoder.encode("Password@123"),
                    "Rohan Sharma",
                    Role.ROLE_STUDENT
            );
            rohan.setVerified(true);
            rohan = userRepository.save(rohan);

            CreditWallet rohanWallet = new CreditWallet(rohan, 5);
            creditWalletRepository.save(rohanWallet);

            StudentProfile rohanProfile = new StudentProfile(rohan, csDept, 3);
            rohanProfile.setBio("Passionate backend developer specializing in Java and Spring Boot. Looking to learn modern UI/UX design.");
            rohanProfile.setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80");
            rohanProfile.setPreferredLearningMode(LearningMode.HYBRID);
            rohanProfile.setAverageRating(BigDecimal.valueOf(4.9));
            rohanProfile.setTotalReviewsCount(8);
            rohanProfile.setTotalSessionsCompleted(12);
            studentProfileRepository.save(rohanProfile);

            // 3. Ananya Iyer (Student 2 - Design)
            User ananya = new User(
                    "ananya@example.com",
                    passwordEncoder.encode("Password@123"),
                    "Ananya Iyer",
                    Role.ROLE_STUDENT
            );
            ananya.setVerified(true);
            ananya = userRepository.save(ananya);

            CreditWallet ananyaWallet = new CreditWallet(ananya, 4);
            creditWalletRepository.save(ananyaWallet);

            StudentProfile ananyaProfile = new StudentProfile(ananya, desDept, 2);
            ananyaProfile.setBio("UI/UX enthusiast creating clean Figma designs. Eager to master React and frontend web frameworks.");
            ananyaProfile.setAvatarUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80");
            ananyaProfile.setPreferredLearningMode(LearningMode.ONLINE);
            ananyaProfile.setAverageRating(BigDecimal.valueOf(5.0));
            ananyaProfile.setTotalReviewsCount(10);
            ananyaProfile.setTotalSessionsCompleted(15);
            studentProfileRepository.save(ananyaProfile);

            // 4. Vikram Patel (Student 3 - CSE)
            User vikram = new User(
                    "vikram@example.com",
                    passwordEncoder.encode("Password@123"),
                    "Vikram Patel",
                    Role.ROLE_STUDENT
            );
            vikram.setVerified(true);
            vikram = userRepository.save(vikram);

            CreditWallet vikramWallet = new CreditWallet(vikram, 3);
            creditWalletRepository.save(vikramWallet);

            StudentProfile vikramProfile = new StudentProfile(vikram, csDept, 4);
            vikramProfile.setBio("Data science and Machine Learning researcher. Happy to teach Python and ML in exchange for acoustic guitar lessons.");
            vikramProfile.setAvatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80");
            vikramProfile.setPreferredLearningMode(LearningMode.HYBRID);
            vikramProfile.setAverageRating(BigDecimal.valueOf(4.8));
            vikramProfile.setTotalReviewsCount(5);
            vikramProfile.setTotalSessionsCompleted(7);
            studentProfileRepository.save(vikramProfile);

            // Assign Skills
            Skill javaSkill = skillRepository.findByNameIgnoreCase("Java & Spring Boot").orElse(null);
            Skill reactSkill = skillRepository.findByNameIgnoreCase("React & JavaScript").orElse(null);
            Skill figmaSkill = skillRepository.findByNameIgnoreCase("Figma UI/UX Design").orElse(null);
            Skill pythonSkill = skillRepository.findByNameIgnoreCase("Python & Data Science").orElse(null);
            Skill guitarSkill = skillRepository.findByNameIgnoreCase("Acoustic Guitar").orElse(null);

            if (javaSkill != null && reactSkill != null && figmaSkill != null) {
                // Rohan teaches Java, wants to learn React & Figma
                userTeachSkillRepository.save(new UserTeachSkill(rohan, javaSkill, ProficiencyLevel.ADVANCED, 24));
                userLearnSkillRepository.save(new UserLearnSkill(rohan, reactSkill, ProficiencyLevel.INTERMEDIATE, Priority.HIGH));
                userLearnSkillRepository.save(new UserLearnSkill(rohan, figmaSkill, ProficiencyLevel.BEGINNER, Priority.MEDIUM));

                // Ananya teaches Figma & React, wants to learn Java
                userTeachSkillRepository.save(new UserTeachSkill(ananya, figmaSkill, ProficiencyLevel.EXPERT, 36));
                userTeachSkillRepository.save(new UserTeachSkill(ananya, reactSkill, ProficiencyLevel.INTERMEDIATE, 12));
                userLearnSkillRepository.save(new UserLearnSkill(ananya, javaSkill, ProficiencyLevel.INTERMEDIATE, Priority.HIGH));
            }

            if (pythonSkill != null && guitarSkill != null) {
                userTeachSkillRepository.save(new UserTeachSkill(vikram, pythonSkill, ProficiencyLevel.EXPERT, 36));
                userLearnSkillRepository.save(new UserLearnSkill(vikram, guitarSkill, ProficiencyLevel.BEGINNER, Priority.HIGH));
            }

            // Assign Availability
            // Rohan available Mon & Wed 17:00-19:00
            availabilityRepository.save(new Availability(rohan, DayOfWeek.MONDAY, LocalTime.of(17, 0), LocalTime.of(19, 0)));
            availabilityRepository.save(new Availability(rohan, DayOfWeek.WEDNESDAY, LocalTime.of(17, 0), LocalTime.of(19, 0)));

            // Ananya available Mon & Wed 17:30-19:30
            availabilityRepository.save(new Availability(ananya, DayOfWeek.MONDAY, LocalTime.of(17, 30), LocalTime.of(19, 30)));
            availabilityRepository.save(new Availability(ananya, DayOfWeek.WEDNESDAY, LocalTime.of(17, 30), LocalTime.of(19, 30)));

            // Vikram available Tue & Thu 18:00-20:00
            availabilityRepository.save(new Availability(vikram, DayOfWeek.TUESDAY, LocalTime.of(18, 0), LocalTime.of(20, 0)));
            availabilityRepository.save(new Availability(vikram, DayOfWeek.THURSDAY, LocalTime.of(18, 0), LocalTime.of(20, 0)));
        }
    }
}
