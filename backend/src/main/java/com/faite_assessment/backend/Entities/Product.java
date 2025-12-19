package com.faite_assessment.backend.Entities;

import com.faite_assessment.backend.Models.Category;
import com.faite_assessment.backend.Models.ProductCondition;
import com.faite_assessment.backend.Models.SaleStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    private Double price;

    @Enumerated(EnumType.STRING)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(name = "product_condition")
    private ProductCondition condition; // NEW / USED

    @Enumerated(EnumType.STRING)
    private SaleStatus saleStatus; // AVAILABLE / SOLD

    private String imageUrl;

    private String phoneNum;
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    private LocalDateTime createdAt;
}
