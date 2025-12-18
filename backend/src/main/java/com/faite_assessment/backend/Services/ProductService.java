package com.faite_assessment.backend.Services;

import com.faite_assessment.backend.Dtos.ProductRequestDTO;
import com.faite_assessment.backend.Entities.Product;
import com.faite_assessment.backend.Entities.User;
import com.faite_assessment.backend.Models.Category;
import com.faite_assessment.backend.Repositories.ProductRepository;
import com.faite_assessment.backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public Product addProduct(ProductRequestDTO dto, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = new Product();
        product.setTitle(dto.getTitle());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setCategory(dto.getCategory());
        product.setCondition(dto.getCondition());
        product.setSaleStatus(dto.getSaleStatus());
        product.setImageUrl(dto.getImageUrl());
        product.setUser(user);
        product.setCreatedAt(LocalDateTime.now());

        return productRepository.save(product);
    }

    public List<Product> getMyProducts(String email) {
        return productRepository.findByUserEmail(email);
    }

    public Product updateProduct(Long id, ProductRequestDTO dto, String email) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Security check: Only the owner can edit
        if (!product.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized to edit this product");
        }

        product.setTitle(dto.getTitle());
        product.setPrice(dto.getPrice());
        product.setDescription(dto.getDescription());
        product.setCondition(dto.getCondition());
        product.setSaleStatus(dto.getSaleStatus());

        return productRepository.save(product);
    }
    // ... inside ProductService class

    // Fetch all available products with filters
    public List<Product> getAllProducts(String keyword, Category category) {
        return productRepository.searchProducts(keyword, category);
    }

    // Fetch single product details (Public view)
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }
}