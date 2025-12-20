package com.faite_assessment.backend.Repositories;

import com.faite_assessment.backend.Entities.Message;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE " +
            "(m.sender.email = :user1 AND m.receiver.email = :user2) OR " +
            "(m.sender.email = :user2 AND m.receiver.email = :user1) " +
            "ORDER BY m.timestamp ASC")
    List<Message> findConversation(@Param("user1") String user1, @Param("user2") String user2);

    // --- FIX: Order by Timestamp DESC so the most recent messages come first ---
    List<Message> findAllBySenderEmailOrReceiverEmailOrderByTimestampDesc(String senderEmail, String receiverEmail);

    long countByReceiverEmailAndIsReadFalse(String receiverEmail);

    @Modifying
    @Transactional
    @Query("UPDATE Message m SET m.isRead = true WHERE m.sender.id = :senderId AND m.receiver.email = :myEmail")
    void markMessagesAsRead(@Param("senderId") Long senderId, @Param("myEmail") String myEmail);
}