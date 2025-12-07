package com.faite_assessment.backend.Controllers;

import com.faite_assessment.backend.Dtos.ActivityLogDTO;
import com.faite_assessment.backend.Entities.User;
import com.faite_assessment.backend.Security.JwtUtil;
import com.faite_assessment.backend.Services.ActivityLogService;
import com.faite_assessment.backend.Services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activity")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityLogService activityLogService;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public List<ActivityLogDTO> getLogs(@RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return activityLogService.getLogsForUser(user)
                .stream()
                .map(log -> new ActivityLogDTO(
                        log.getAction(),
                        log.getCreatedAt()
                ))
                .toList();
    }
}
