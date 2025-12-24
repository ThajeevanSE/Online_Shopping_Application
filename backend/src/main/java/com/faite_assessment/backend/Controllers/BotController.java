package com.faite_assessment.backend.Controllers;

import com.faite_assessment.backend.Services.BotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/bot")
@RequiredArgsConstructor
public class BotController {

    private final BotService botService;

    @PostMapping("/ask")
    public ResponseEntity<Map<String, String>> askBot(@RequestBody Map<String, String> payload) {
        String userMessage = payload.get("message");
        String aiResponse = botService.getAiResponse(userMessage);
        return ResponseEntity.ok(Map.of("response", aiResponse));
    }
}