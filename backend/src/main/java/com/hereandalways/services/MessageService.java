package com.hereandalways.services;

import com.hereandalways.models.Message;
import com.hereandalways.models.User;
import com.hereandalways.models.enums.DeliveryStatus;
import com.hereandalways.payload.request.UpdateMessageRequest;
import com.hereandalways.repositories.MessageRepository;
import com.hereandalways.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepo;
    private final UserRepository userRepo;

    @Transactional
    public Message createMessage(
            UUID ownerId,
            String subject,
            String body,
            LocalDateTime scheduledDelivery,
            List<UUID> trusteeIds,
            DeliveryStatus status
    ) {
        // find owner
        User owner = userRepo.findById(ownerId)
                .orElseThrow(() -> new IllegalArgumentException("Owner not found with id: " + ownerId));

        // validate for QUEUED
        if (status == DeliveryStatus.QUEUED) {
            if (subject == null || subject.isBlank() || body == null || body.isBlank()) {
                throw new IllegalArgumentException("Subject and body are required to send a message.");
            }
        }

        // create message
        Message message = new Message();
        message.setLegacyOwner(owner);
        message.setSubject(subject);
        message.setBody(body);
        message.setScheduledDelivery(scheduledDelivery);
        message.setDeliveryStatus(status);

        // attach trustees if provided
        if (trusteeIds != null && !trusteeIds.isEmpty()) {
            List<User> trustees = userRepo.findAllById(trusteeIds);
            message.setTrustees(trustees);
        }

        return messageRepo.save(message);
    }

    @Transactional(readOnly = true)
    public List<Message> getMessagesForOwner(UUID ownerId) {
        return messageRepo.findByLegacyOwnerId(ownerId);
    }

    @Transactional
    public Message getMessage(UUID id) {
        Message message = messageRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Message not found with id: " + id));
        message.setLastAccessedAt(LocalDateTime.now());
        return messageRepo.save(message);
    }

    @Transactional
    public void deleteMessage(UUID id) {
        messageRepo.deleteById(id);
    }

    // @Transactional
    // public Message updateStatus(UUID messageId, DeliveryStatus newStatus) {
    //     Message message = messageRepo.findById(messageId)
    //             .orElseThrow(() -> new IllegalArgumentException("Message not found with id: " + messageId));
    //     message.setDeliveryStatus(newStatus);
    //     return messageRepo.save(message);
    // }

    @Transactional(readOnly = true)
    public List<Message> getRecentMessages(UUID ownerId) {
        return messageRepo.findByLegacyOwnerIdOrderByLastAccessedAtDesc(ownerId);
    }

 @Transactional
    public Message updateMessage(
        UUID messageId,
        String subject,
        String body,
        LocalDateTime scheduledDelivery,
        List<UUID> trusteeIds,
        DeliveryStatus status
    ) {
        log.info("🔍 Looking for message {}", messageId);
        Message message = messageRepo.findById(messageId)
                .orElseThrow(() -> {
                    log.error("❌ Message not found: {}", messageId);
                    return new RuntimeException("Message not found");
                });

        log.info("📝 Current message state - Status: {}, Subject: '{}'", 
            message.getDeliveryStatus(), message.getSubject());

        // Apply updates
        if (subject != null) {
            log.info("🔄 Updating subject from '{}' to '{}'", message.getSubject(), subject);
            message.setSubject(subject);
        }

        if (body != null) {
            log.info("🔄 Updating body content");
            message.setBody(body);
        }

        if (scheduledDelivery != null) {
            log.info("🔄 Updating scheduled delivery from {} to {}", 
                message.getScheduledDelivery(), scheduledDelivery);
            message.setScheduledDelivery(scheduledDelivery);
        }

        if (trusteeIds != null) {
            log.info("🔄 Updating trustees to: {}", trusteeIds);
            List<User> trustees = userRepo.findAllById(trusteeIds);
            message.setTrustees(trustees);
        }

        // Force status update if provided
        if (status != null) {
            log.info("🔄 Updating status from {} to {}", 
                message.getDeliveryStatus(), status);
            message.setDeliveryStatus(status);
        }

        log.info("💾 Saving updated message...");
        Message saved = messageRepo.saveAndFlush(message); // Using saveAndFlush to ensure immediate write
        
        // Verify the save
        Message freshFromDb = messageRepo.findById(messageId).orElseThrow();
        log.info("💾 Fresh from DB - Status: {}, Subject: '{}'", 
            freshFromDb.getDeliveryStatus(), freshFromDb.getSubject());
        
        return saved;
    }
}
