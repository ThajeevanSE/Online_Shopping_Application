package com.faite_assessment.backend.Controllers;

import com.faite_assessment.backend.Dtos.ProductRequestDTO;
import com.faite_assessment.backend.Entities.Product;
import com.faite_assessment.backend.Models.Category;
import com.faite_assessment.backend.Services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping(value = "/add", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Product> addProduct(
            @RequestPart("dto") ProductRequestDTO dto,
            @RequestPart("image") MultipartFile image,
            Authentication authentication) throws IOException {

        String email = authentication.getName();


        Path uploadPath = Paths.get("uploads");
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
        Path path = uploadPath.resolve(fileName);
        Files.copy(image.getInputStream(), path);

        dto.setImageUrl("/uploads/" + fileName);

        return ResponseEntity.ok(productService.addProduct(dto, email));
    }

    @GetMapping("/my-products")
    public ResponseEntity<List<Product>> getMyProducts(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(productService.getMyProducts(email));
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody ProductRequestDTO dto, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(productService.updateProduct(id, dto, email));
    }
   
    @GetMapping("/browse")
    public ResponseEntity<List<Product>> browseProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {

        // Convert string category to Enum safely
        Category catEnum = null;
        if (category != null && !category.isEmpty()) {
            try {
                catEnum = Category.valueOf(category.toUpperCase());
            } catch (IllegalArgumentException e) {
                // If invalid category passed, ignore it or handle error
            }
        }

        return ResponseEntity.ok(productService.getAllProducts(search, catEnum));
    }

    // Single Product Detail View
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }
}