package com.courseplatform.service;

import com.courseplatform.dto.response.NotificationResponse;
import com.courseplatform.entity.*;
import com.courseplatform.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired NotificationRepository notifRepo;

    public void send(User sender, User recipient, Notification.NotificationType type, String message) {
        Notification n = Notification.builder()
            .sender(sender)
            .recipient(recipient)
            .type(type)
            .message(message)
            .build();
        notifRepo.save(n);
    }

    public List<NotificationResponse> getForUser(Long userId) {
        return notifRepo.findByRecipientIdOrderByCreatedAtDesc(userId)
            .stream().map(n -> NotificationResponse.builder()
                .id(n.getId())
                .type(n.getType().name())
                .message(n.getMessage())
                .read(n.isRead())
                .createdAt(n.getCreatedAt())
                .senderName(n.getSender() != null ? n.getSender().getUsername() : "System")
                .build())
            .collect(Collectors.toList());
    }

    public long getUnreadCount(Long userId) {
        return notifRepo.countByRecipientIdAndReadFalse(userId);
    }

    public void markAllRead(Long userId) {
        List<Notification> unread = notifRepo.findByRecipientIdOrderByCreatedAtDesc(userId)
            .stream().filter(n -> !n.isRead()).collect(Collectors.toList());
        unread.forEach(n -> n.setRead(true));
        notifRepo.saveAll(unread);
    }
}