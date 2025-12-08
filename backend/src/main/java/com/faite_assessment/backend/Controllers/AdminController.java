package com.faite_assessment.backend.Controllers;

import com.faite_assessment.backend.Entities.User;
import com.faite_assessment.backend.Security.JwtUtil;
import com.faite_assessment.backend.Services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final JwtUtil jwtUtil;


    private void ensureAdmin(String token) {

        if (token == null || token.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No token provided");
        }

        String email;
        try {
            email = jwtUtil.extractEmail(token);
        } catch (Exception e) {
            // token invalid/expired
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token: " + e.getMessage());
        }

        System.out.println("[ADMIN CHECK] token-substr (first 10): " + (token.length() > 10 ? token.substring(0, 10) + "..." : token));
        System.out.println("[ADMIN CHECK] extracted email: " + email);

        User user = userService.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        System.out.println("[ADMIN CHECK] user role: " + user.getRole());

        if (!"ADMIN".equalsIgnoreCase(user.getRole().name())) {

            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: Admin only");
        }
    }

    @GetMapping("/users")
    public List<User> getAllUsers(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        ensureAdmin(token);

        return userService.getAllUsers();
    }


    @DeleteMapping("/users/{id}")
    public String deleteUser(@RequestHeader("Authorization") String authHeader,
                             @PathVariable Long id) {

        String token = authHeader.substring(7);
        ensureAdmin(token);

        userService.deleteUser(id);
        return "User deleted successfully";
    }
}
