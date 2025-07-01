package com.hereandalways.services;

import com.hereandalways.models.Message;
import com.hereandalways.models.User;
import com.hereandalways.models.enums.DeliveryStatus;
import com.hereandalways.payload.request.MessageRequest;
import com.hereandalways.repositories.MessageRepository;
import com.hereandalways.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepo;
    private final UserRepository userRepo;

  @Transactional
public Message createMessage(UUID ownerId, MessageRequest request) {
    User owner = userRepo.findById(ownerId)
            .orElseThrow(() -> new IllegalArgumentException("Legacy owner not found with id: " + ownerId));

    User trustee = null;
    if (request.getTrusteeId() != null) {
        trustee = userRepo.findById(request.getTrusteeId())
                .orElseThrow(() -> new IllegalArgumentException("Trustee not found with id: " + request.getTrusteeId()));
    }

    Message message = new Message();
    message.setLegacyOwner(owner);
    message.setTrustee(trustee);
    message.setSubject(request.getSubject());
    message.setBody(request.getBody());
    message.setScheduledDelivery(request.getScheduledDelivery());
     message.setDeliveryStatus(
        request.getScheduledDelivery() != null ? DeliveryStatus.QUEUED : DeliveryStatus.DRAFT
    );

    return messageRepo.save(message);
}


    @Transactional(readOnly = true)
    public List<Message> getMessagesForOwner(UUID ownerId) {
        return messageRepo.findByLegacyOwnerId(ownerId);
    }

    @Transactional
    public void deleteMessage(UUID messageId) {
        messageRepo.deleteById(messageId);
    }
}
