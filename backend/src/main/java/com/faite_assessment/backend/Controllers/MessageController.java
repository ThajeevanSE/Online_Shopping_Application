package com.faite_assessment.backend.Controllers;

import com.faite_assessment.backend.Entities.Message;
import com.faite_assessment.backend.Entities.User;
import com.faite_assessment.backend.Services.MessageService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @Data
    public static class MessageRequest {
        // removed senderEmail because we get it from Principal now (Secure)
        private Long receiverId;
        private String content;
    }

    // --- WEBSOCKET ---
    @MessageMapping("/chat")
    public void processMessage(@Payload MessageRequest request, Principal principal) {
        // principal is now NOT NULL thanks to WebSocketConfig interceptor
        String senderEmail = principal.getName();

        Message savedMsg = messageService.sendMessage(
                senderEmail,
                request.getReceiverId(),
                null,
                request.getContent()
        );

        // Send to Receiver
        messagingTemplate.convertAndSendToUser(
                savedMsg.getReceiver().getEmail(),
                "/queue/messages",
                savedMsg
        );

        // Send back to Sender (so it appears on their screen too if using multiple devices)
        messagingTemplate.convertAndSendToUser(
                senderEmail,
                "/queue/messages",
                savedMsg
        );
    }

    // --- REST API ---

    @GetMapping("/api/messages/conversation/{userId}")
    public ResponseEntity<List<Message>> getConversation(@PathVariable Long userId, Authentication authentication) {
        return ResponseEntity.ok(messageService.getConversation(authentication.getName(), userId));
    }

    @GetMapping("/api/messages/inbox")
    public ResponseEntity<List<User>> getInbox(Authentication authentication) {
        return ResponseEntity.ok(messageService.getInbox(authentication.getName()));
    }

    @GetMapping("/api/messages/unread-count")
    public ResponseEntity<Long> getUnreadCount(Authentication authentication) {
        return ResponseEntity.ok(messageService.getUnreadCount(authentication.getName()));
    }

    @PostMapping("/api/messages/mark-read/{senderId}")
    public ResponseEntity<Void> markAsRead(@PathVariable Long senderId, Authentication authentication) {
        messageService.markAsRead(senderId, authentication.getName());
        return ResponseEntity.ok().build();
    }
}