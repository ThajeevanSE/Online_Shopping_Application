package com.faite_assessment.backend.Services;

import com.faite_assessment.backend.Entities.Product;
import com.faite_assessment.backend.Entities.User;
import com.faite_assessment.backend.Repositories.ProductRepository;
import com.faite_assessment.backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public void toggleWishlist(String email, Long productId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if the list contains the product
        if (user.getFavoriteProducts().contains(product)) {
            user.getFavoriteProducts().remove(product); // Unlike
        } else {
            user.getFavoriteProducts().add(product);    // Like
        }

        userRepository.save(user); // JPA updates the join table automatically
    }

    public List<Product> getWishlist(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getFavoriteProducts();
    }
}