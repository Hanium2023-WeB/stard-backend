package com.web.stard.notification.service;

import com.web.stard.domain.Member;
import com.web.stard.notification.domain.NotificationType;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface NotificationService {

    SseEmitter subscribe(String userId, String lastEventId);
    void notify(String userId, Object event);

    void sendToClient(SseEmitter emitter, String id, Object data);

    SseEmitter createEmitter(String id);

    void send(Member receiver, NotificationType notificationType, String content, String url);

}
