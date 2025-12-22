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
        private Long receiverId;
        private Long productId;
        private String content;
    }

    // WEBSOCKET
    @MessageMapping("/chat")
    public void processMessage(@Payload MessageRequest request, Principal principal) {
        String senderEmail = principal.getName();

        Message savedMsg = messageService.sendMessage(
                senderEmail,
                request.getReceiverId(),
                null,
                request.getContent()
        );

        messagingTemplate.convertAndSendToUser(
                savedMsg.getReceiver().getEmail(),
                "/queue/messages",
                savedMsg
        );

        messagingTemplate.convertAndSendToUser(
                senderEmail,
                "/queue/messages",
                savedMsg
        );
    }

    // REST API

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

    @PostMapping("/api/messages/send")
    public ResponseEntity<Message> sendMessageRest(@RequestBody MessageRequest request, Principal principal) {
        String senderEmail = principal.getName();
        
        Message savedMsg = messageService.sendMessage(
                senderEmail,
                request.getReceiverId(),
                request.getProductId(),
                request.getContent()
        );

        messagingTemplate.convertAndSendToUser(
                savedMsg.getReceiver().getEmail(),
                "/queue/messages",
                savedMsg
        );

        return ResponseEntity.ok(savedMsg);
    }
}