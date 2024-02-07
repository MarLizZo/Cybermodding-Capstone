package com.cybermodding.runners;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.util.UriTemplate;

import com.cybermodding.entities.PrivateMessage;
import com.cybermodding.payload.PMDTO;
import com.cybermodding.repositories.UserRepo;
import com.cybermodding.services.PMService;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
@SuppressWarnings("null")
public class WSPMsHandler extends TextWebSocketHandler {
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    UserRepo u_repo;
    @Autowired
    PMService pm_svc;
    private static Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    private String extractUserId(WebSocketSession session) {
        String userId = (String) session.getAttributes().get("userId");
        if (userId == null) {
            userId = new UriTemplate("/pms/{userId}").match(session.getUri().toString()).get("userId");
        }
        return userId;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String userId = extractUserId(session);
        if (!userId.equals("0")) {
            if (u_repo.existsById(Long.valueOf(userId))) {
                sessions.put(userId, session);
            }
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // NEW SCRIPT
        String payload = message.getPayload();
        PMDTO obj = objectMapper.readValue(payload, PMDTO.class);
        boolean usersExists = u_repo.existsById(obj.getSender_id()) && u_repo.existsById(obj.getRecipient_id());

        if (usersExists) {
            PrivateMessage pm = PrivateMessage.builder().title(obj.getTitle()).content(obj.getContent())
                    .date(LocalDateTime.now()).sender_user(u_repo.findById(obj.getSender_id()).get())
                    .recipient_user(u_repo.findById(obj.getRecipient_id()).get()).build();

            pm_svc.saveNewPM(pm);

            TextMessage stringifiedMsg = new TextMessage(objectMapper.writeValueAsString(pm));
            if (sessions.containsKey(obj.getRecipient_id().toString())) {
                sessions.get(obj.getRecipient_id().toString()).sendMessage(stringifiedMsg);
            }
            session.sendMessage(stringifiedMsg);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String userId = extractUserId(session);
        if (!userId.equals("0")) {
            if (u_repo.existsById(Long.valueOf(userId))) {
                sessions.remove(userId);
            }
        }
    }
}
