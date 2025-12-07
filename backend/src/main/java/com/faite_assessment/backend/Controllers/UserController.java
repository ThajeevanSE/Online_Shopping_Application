package com.faite_assessment.backend.Controllers;

import com.faite_assessment.backend.Entities.User;
import com.faite_assessment.backend.Security.JwtUtil;
import com.faite_assessment.backend.Services.ActivityLogService;
import com.faite_assessment.backend.Services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;
    private final ActivityLogService activityLogService;

    //GET LOGGED-IN USER
    @GetMapping("/me")
    public User getLoggedInUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        return userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    //UPDATE PROFILE
    @PutMapping("/update")
    public User updateProfile(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestPart("name") String name,
            @RequestPart(value = "dateOfBirth", required = false) String dob,
            @RequestPart(value = "profilePicture", required = false) MultipartFile file
    ) throws IOException {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));


        if (name != null && !name.trim().isEmpty()) {
            user.setName(name.trim());
        }


        if (dob != null && !dob.trim().isEmpty()) {
            user.setDateOfBirth(LocalDate.parse(dob));
        }


        if (file != null && !file.isEmpty()) {

            // Allow only images
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("Only image files are allowed");
            }

            // Safe project root folder
            String uploadBase = System.getProperty("user.dir");
            String folder = uploadBase + File.separator + "uploads" + File.separator + "profile_pictures";

            File dir = new File(folder);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // Clean and safe filename
            String original = file.getOriginalFilename().replaceAll("[^a-zA-Z0-9._-]", "");
            String fileName = user.getId() + "_" + System.currentTimeMillis() + "_" + original;

            String filePath = folder + File.separator + fileName;

            file.transferTo(new File(filePath));

            // Save public path
            user.setProfilePicture("/uploads/profile_pictures/" + fileName);
        }

        User saved = userService.saveUser(user);
        activityLogService.log(saved, "Profile updated");

        return saved;
    }


    //CHANGE PASSWORD
    @PutMapping("/change-password")
    public String changePassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body
    ) {

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String oldPw = body.get("oldPassword");
        String newPw = body.get("newPassword");

        if (!passwordEncoder.matches(oldPw, user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPw));
        userService.saveUser(user);

        activityLogService.log(user, "Password changed");

        return "Password updated successfully";
    }
}
