package com.faite_assessment.backend.Controllers;

import com.faite_assessment.backend.Entities.User;
import com.faite_assessment.backend.Models.Role;
import com.faite_assessment.backend.Security.JwtUtil;
import com.faite_assessment.backend.Services.ActivityLogService;
import com.faite_assessment.backend.Services.EmailService; // Import this
import com.faite_assessment.backend.Services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final ActivityLogService activityLogService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService; // Inject EmailService
    @PostMapping("/register")
    public String register(@RequestBody User user) {

        if (userService.emailExists(user.getEmail())) {
            return "Email already exists";
        }


        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.USER);

        User saved = userService.saveUser(user);

        activityLogService.log(saved, "User registered");

        return "Registration successful";
    }


    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> loginData) {

        String email = loginData.get("email");
        String password = loginData.get("password");

        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        activityLogService.log(user, "User logged in");

        return Map.of(
                "token", token,
                "role", user.getRole().name(),
                "name", user.getName()
        );
    }

    // --- NEW: FORGOT PASSWORD (Generate OTP) ---
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate 6 digit OTP
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        user.setOtp(otp);
        user.setOtpGeneratedTime(LocalDateTime.now());
        userService.saveUser(user);

        emailService.sendOtpEmail(email, otp);

        return ResponseEntity.ok("OTP sent to your email");
    }

    // --- NEW: RESET PASSWORD (Verify OTP & Update Password) ---
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if OTP matches and is within 5 minutes (validity)
        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid OTP");
        }

        if (Duration.between(user.getOtpGeneratedTime(), LocalDateTime.now()).getSeconds() > (5 * 60)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("OTP Expired");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setOtp(null); // Clear OTP after use
        userService.saveUser(user);

        activityLogService.log(user, "Password reset successfully");

        return ResponseEntity.ok("Password reset successfully");
    }
}