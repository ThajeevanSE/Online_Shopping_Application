package com.faite_assessment.backend.Services;

import com.faite_assessment.backend.Entities.Message;
import com.faite_assessment.backend.Entities.Product;
import com.faite_assessment.backend.Entities.User;
import com.faite_assessment.backend.Repositories.MessageRepository;
import com.faite_assessment.backend.Repositories.ProductRepository;
import com.faite_assessment.backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashSet; // Import LinkedHashSet
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public Message sendMessage(String senderEmail, Long receiverId, Long productId, String content) {
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Product product = null;
        if(productId != null) {
            product = productRepository.findById(productId).orElse(null);
        }

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setProduct(product);
        message.setContent(content);

        return messageRepository.save(message);
    }

    public List<Message> getConversation(String email1, Long userId2) {
        User user2 = userRepository.findById(userId2)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return messageRepository.findConversation(email1, user2.getEmail());
    }

    public List<User> getInbox(String myEmail) {
        // 1. Get messages ordered by NEWEST first
        List<Message> messages = messageRepository.findAllBySenderEmailOrReceiverEmailOrderByTimestampDesc(myEmail, myEmail);

        // 2. Extract unique partners using LinkedHashSet to maintain order
        Set<User> partners = new LinkedHashSet<>();

        for (Message m : messages) {
            if (m.getSender().getEmail().equals(myEmail)) {
                partners.add(m.getReceiver());
            } else {
                partners.add(m.getSender());
            }
        }

        return new ArrayList<>(partners);
    }

    public long getUnreadCount(String email) {
        return messageRepository.countByReceiverEmailAndIsReadFalse(email);
    }

    public void markAsRead(Long senderId, String myEmail) {
        messageRepository.markMessagesAsRead(senderId, myEmail);
    }
}