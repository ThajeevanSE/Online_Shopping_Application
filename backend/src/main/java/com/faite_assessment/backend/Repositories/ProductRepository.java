package com.faite_assessment.backend.Repositories;

import com.faite_assessment.backend.Entities.Product;
import com.faite_assessment.backend.Models.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // Find all products where the owner's email matches
    List<Product> findByUserEmail(String email);

    @Query("SELECT p FROM Product p WHERE p.saleStatus = 'AVAILABLE' " +
            "AND (:category IS NULL OR p.category = :category) " +
            "AND (:keyword IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "ORDER BY p.createdAt DESC")
    List<Product> searchProducts(@Param("keyword") String keyword, @Param("category") Category category);
}