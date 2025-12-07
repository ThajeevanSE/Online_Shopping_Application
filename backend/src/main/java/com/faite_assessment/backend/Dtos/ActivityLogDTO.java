package com.faite_assessment.backend.Dtos;

import java.time.LocalDateTime;

public record ActivityLogDTO(
        String action,
        LocalDateTime createdAt
) {}
