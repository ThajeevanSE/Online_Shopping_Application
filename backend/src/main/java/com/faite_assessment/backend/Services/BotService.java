package com.faite_assessment.backend.Services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BotService {


    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getAiResponse(String userMessage) {

        String finalUrl = apiUrl + "?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);


        Map<String, Object> body = new HashMap<>();

        Map<String, Object> part = new HashMap<>();
        part.put("text", "You are a helpful support assistant. User asks: " + userMessage);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", List.of(part));

        body.put("contents", List.of(content));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(finalUrl, request, Map.class);
            Map<String, Object> responseBody = response.getBody();


            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> firstCandidate = candidates.get(0);
                Map<String, Object> candidateContent = (Map<String, Object>) firstCandidate.get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) candidateContent.get("parts");
                return (String) parts.get(0).get("text");
            }
            return "I couldn't understand that.";

        } catch (Exception e) {
            e.printStackTrace();
            return "I'm having trouble connecting to Google Gemini right now.";
        }
    }
}