package com.faite_assessment.backend.Controllers;

import com.faite_assessment.backend.Entities.Product;
import com.faite_assessment.backend.Entities.User;
import com.faite_assessment.backend.Security.JwtUtil;
import com.faite_assessment.backend.Services.ProductService;
import com.faite_assessment.backend.Services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final ProductService productService; // Inject ProductService
    private final JwtUtil jwtUtil;

    // Helper method to validate Admin access
    private void ensureAdmin(String token) {
        if (token == null || token.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No token provided");
        }
        String email;
        try {
            email = jwtUtil.extractEmail(token);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
        }
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!"ADMIN".equalsIgnoreCase(user.getRole().name())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: Admin only");
        }
    }

    // --- EXISTING USER ENDPOINTS ---

    @GetMapping("/users")
    public List<User> getAllUsers(@RequestHeader("Authorization") String authHeader) {
        ensureAdmin(authHeader.substring(7));
        return userService.getAllUsers();
    }

    @DeleteMapping("/users/{id}")
    public String deleteUser(@RequestHeader("Authorization") String authHeader, @PathVariable Long id) {
        ensureAdmin(authHeader.substring(7));
        userService.deleteUser(id);
        return "User deleted successfully";
    }

    // --- NEW PRODUCT ENDPOINTS ---

    @GetMapping("/products")
    public List<Product> getAllProducts(@RequestHeader("Authorization") String authHeader) {
        ensureAdmin(authHeader.substring(7));
        return productService.getAllProducts();
    }

    @DeleteMapping("/products/{id}")
    public String deleteProduct(@RequestHeader("Authorization") String authHeader, @PathVariable Long id) {
        ensureAdmin(authHeader.substring(7));
        productService.adminDeleteProduct(id);
        return "Product deleted successfully by Admin";
    }

    // --- NEW DASHBOARD STATS ENDPOINT ---

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@RequestHeader("Authorization") String authHeader) {
        ensureAdmin(authHeader.substring(7));

        Map<String, Object> stats = new HashMap<>();

        // 1. Total Counts
        long totalUsers = userService.getAllUsers().size();
        long totalProducts = productService.getAllProducts().size();

        // 2. Products by Category (For Pie Chart)
        // Returns list like: [["ELECTRONICS", 5], ["TRAVEL", 2]]
        List<Object[]> categoryStats = productService.getProductStats();

        stats.put("totalUsers", totalUsers);
        stats.put("totalProducts", totalProducts);
        stats.put("categoryStats", categoryStats);

        return ResponseEntity.ok(stats);
    }
}