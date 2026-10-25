package com.skillswap.service;

import com.skillswap.dto.AuthResponse;
import com.skillswap.dto.LoginRequest;
import com.skillswap.dto.RefreshTokenRequest;
import com.skillswap.dto.RegisterRequest;
import com.skillswap.dto.VerifyEmailRequest;
import com.skillswap.entity.CreditTransaction;
import com.skillswap.entity.CreditWallet;
import com.skillswap.entity.Department;
import com.skillswap.entity.Role;
import com.skillswap.entity.StudentProfile;
import com.skillswap.entity.TransactionType;
import com.skillswap.entity.User;
import com.skillswap.exception.DuplicateResourceException;
import com.skillswap.exception.InvalidVerificationCodeException;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.repository.CreditTransactionRepository;
import com.skillswap.repository.CreditWalletRepository;
import com.skillswap.repository.DepartmentRepository;
import com.skillswap.repository.StudentProfileRepository;
import com.skillswap.repository.UserRepository;
import com.skillswap.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.regex.Pattern;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;
    private final DepartmentRepository departmentRepository;
    private final CreditWalletRepository walletRepository;
    private final CreditTransactionRepository transactionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final Pattern emailDomainPattern;

    public AuthService(
            UserRepository userRepository,
            StudentProfileRepository profileRepository,
            DepartmentRepository departmentRepository,
            CreditWalletRepository walletRepository,
            CreditTransactionRepository transactionRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider,
            @Value("${app.email.domain-regex:^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+[.][A-Za-z]{2,}$}") String emailRegex) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.departmentRepository = departmentRepository;
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.emailDomainPattern = Pattern.compile(emailRegex, Pattern.CASE_INSENSITIVE);
    }

    @Transactional
    public User register(RegisterRequest req) {
        String normalizedEmail = req.getEmail().trim().toLowerCase();

        if (!emailDomainPattern.matcher(normalizedEmail).matches()) {
            throw new IllegalArgumentException("Please enter a valid email address.");
        }

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new DuplicateResourceException("An account with email " + normalizedEmail + " already exists.");
        }

        Department department = departmentRepository.findById(req.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + req.getDepartmentId()));

        User user = new User(normalizedEmail, passwordEncoder.encode(req.getPassword()), req.getFullName().trim(), Role.ROLE_STUDENT);

        // Generate 6-digit numeric OTP
        String otp = String.format("%06d", new SecureRandom().nextInt(1000000));
        user.setOtpCode(otp);
        user.setOtpExpiresAt(Instant.now().plusSeconds(900)); // 15 minutes
        user.setVerified(false);
        user = userRepository.save(user);

        StudentProfile profile = new StudentProfile(user, department, req.getGraduationYear());
        profile.setBio("Hello! I am a student at " + department.getName());
        profileRepository.save(profile);

        // In development/test, log OTP to console for easy testing
        System.out.println("=================================================");
        System.out.println("SKILLSWAP REGISTRATION OTP FOR " + normalizedEmail + ": " + otp);
        System.out.println("=================================================");

        return user;
    }

    @Transactional
    public AuthResponse verifyEmail(VerifyEmailRequest req) {
        String normalizedEmail = req.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + normalizedEmail));

        if (user.isVerified()) {
            return null;
        }

        if (user.getOtpExpiresAt() == null || Instant.now().isAfter(user.getOtpExpiresAt())) {
            throw new InvalidVerificationCodeException("Verification OTP has expired. Please request a new one.");
        }

        if (!req.getOtpCode().equals(user.getOtpCode())) {
            throw new InvalidVerificationCodeException("Invalid verification code.");
        }

        user.setVerified(true);
        user.setOtpCode(null);
        user.setOtpExpiresAt(null);
        userRepository.save(user);

        // Provision initial Credit Wallet with 3 Welcome Credits
        if (walletRepository.findByUserId(user.getId()).isEmpty()) {
            CreditWallet wallet = new CreditWallet(user, 3);
            wallet = walletRepository.save(wallet);

            CreditTransaction txn = new CreditTransaction(
                    wallet, null, TransactionType.SIGNUP_BONUS, 3, 3, "Welcome bonus for verifying email"
            );
            transactionRepository.save(txn);
        }

        // Generate tokens for the verified user
        String accessToken = tokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        String refreshToken = tokenProvider.generateRefreshToken(user.getId(), user.getEmail());

        String avatarUrl = profileRepository.findByUserId(user.getId())
                .map(StudentProfile::getAvatarUrl)
                .orElse(null);

        return new AuthResponse(
                accessToken,
                refreshToken,
                tokenProvider.getExpirationMs() / 1000,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                avatarUrl
        );
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        String normalizedEmail = req.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        if (!user.isActive()) {
            throw new IllegalStateException("Your account has been suspended. Please contact support.");
        }

        if (!user.isVerified()) {
            throw new IllegalStateException("Please verify your email address with the 6-digit OTP before logging in.");
        }

        String accessToken = tokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        String refreshToken = tokenProvider.generateRefreshToken(user.getId(), user.getEmail());

        String avatarUrl = profileRepository.findByUserId(user.getId())
                .map(StudentProfile::getAvatarUrl)
                .orElse(null);

        return new AuthResponse(
                accessToken,
                refreshToken,
                tokenProvider.getExpirationMs() / 1000,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                avatarUrl
        );
    }

    @Transactional(readOnly = true)
    public AuthResponse refreshToken(RefreshTokenRequest req) {
        if (!tokenProvider.validateToken(req.getRefreshToken())) {
            throw new BadCredentialsException("Invalid or expired refresh token");
        }

        String email = tokenProvider.getEmailFromToken(req.getRefreshToken());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.isActive() || !user.isVerified()) {
            throw new IllegalStateException("User account is inactive or unverified");
        }

        String newAccessToken = tokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        String newRefreshToken = tokenProvider.generateRefreshToken(user.getId(), user.getEmail());

        String avatarUrl = profileRepository.findByUserId(user.getId())
                .map(StudentProfile::getAvatarUrl)
                .orElse(null);

        return new AuthResponse(
                newAccessToken,
                newRefreshToken,
                tokenProvider.getExpirationMs() / 1000,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                avatarUrl
        );
    }
}
