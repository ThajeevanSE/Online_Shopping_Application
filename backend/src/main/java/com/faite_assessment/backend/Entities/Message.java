package com.faite_assessment.backend.Entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Data
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;


    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(nullable = false, length = 1000)
    private String content;

    @Column(nullable = false)
    private boolean isRead = false;

    private LocalDateTime timestamp;

    @PrePersist
    public void onCreate() {
        timestamp = LocalDateTime.now();
    }
}