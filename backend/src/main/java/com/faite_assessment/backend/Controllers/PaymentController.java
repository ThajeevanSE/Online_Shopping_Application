package com.faite_assessment.backend.Controllers;

import com.faite_assessment.backend.Services.PaymentService;
import com.stripe.model.PaymentIntent;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @Data
    public static class PaymentRequest {
        private Double amount; // Price of the product
    }

    @PostMapping("/create-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(@RequestBody PaymentRequest request) {
        try {
            PaymentIntent intent = paymentService.createPaymentIntent(request.getAmount(), "usd");

            // Return the clientSecret to the frontend
            return ResponseEntity.ok(Map.of("clientSecret", intent.getClientSecret()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}