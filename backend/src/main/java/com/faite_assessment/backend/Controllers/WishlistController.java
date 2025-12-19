package com.faite_assessment.backend.Controllers;

import com.faite_assessment.backend.Entities.Product;
import com.faite_assessment.backend.Services.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    // Endpoint to Like/Unlike a product
    @PostMapping("/toggle/{productId}")
    public ResponseEntity<String> toggleWishlist(@PathVariable Long productId, Authentication authentication) {
        wishlistService.toggleWishlist(authentication.getName(), productId);
        return ResponseEntity.ok("Wishlist updated");
    }

    // Endpoint to view all liked products
    @GetMapping("/my-wishlist")
    public ResponseEntity<List<Product>> getMyWishlist(Authentication authentication) {
        return ResponseEntity.ok(wishlistService.getWishlist(authentication.getName()));
    }
}