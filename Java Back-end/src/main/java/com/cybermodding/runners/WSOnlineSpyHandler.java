package com.cybermodding.runners;

import java.util.concurrent.ConcurrentHashMap;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.util.UriTemplate;

import com.cybermodding.entities.User;
import com.cybermodding.enumerators.EUserLevel;
import com.cybermodding.factory.UserFactory;
import com.cybermodding.responses.OnlineSpyUserModel;
import com.cybermodding.services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
@SuppressWarnings("null")
public class WSOnlineSpyHandler extends TextWebSocketHandler {
    @Autowired
    UserService u_svc;
    private static List<OnlineSpyUserModel> users = new ArrayList<>();
    private static Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    private String extractUserId(WebSocketSession session) {
        String userId = (String) session.getAttributes().get("userId");
        if (userId == null) {
            userId = new UriTemplate("/online/{userId}").match(session.getUri().toString()).get("userId");
        }
        return userId;
    }

    private void sendOnlineUsersToClient() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        String onlineUsersJson = objectMapper.writeValueAsString(users);

        for (WebSocketSession session : sessions.values()) {
            session.sendMessage(new TextMessage(onlineUsersJson));
        }
    }

    private void sendOnlineUsersToClientAfterDisconnect(String sessionId) throws Exception {
        users.removeIf(el -> el.getSession_id().equals(sessionId));
        ObjectMapper objectMapper = new ObjectMapper();
        String onlineUsersJson = objectMapper.writeValueAsString(users);
        sessions.remove(sessionId);

        for (WebSocketSession session : sessions.values()) {
            session.sendMessage(new TextMessage(onlineUsersJson));
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String userId = extractUserId(session);
        if (!userId.equals("0")) {
            User u = u_svc.getById(Long.valueOf(userId));
            if (u != null) {
                // add a logged user
                users.add(new OnlineSpyUserModel(u.getId(), u.getUsername(), UserFactory.getRank(u), session.getId()));
            }
        } else {
            // add a guest
            users.add(new OnlineSpyUserModel(0l, "", EUserLevel.BASE, session.getId()));
        }
        // add the new entity to the map
        sessions.put(session.getId(), session);
        sendOnlineUsersToClient();
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();

        if (payload.contains("remove")) {
            for (OnlineSpyUserModel osum : users) {
                if (osum.getSession_id().equals(session.getId())) {
                    users.remove(osum);
                    break;
                }
            }
            sendOnlineUsersToClient();
            if (sessions.containsKey(session.getId())) {
                sessions.remove(session.getId());
            }
        } else if (payload.contains("new")) {
            // some other actions if needed in the future
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sendOnlineUsersToClientAfterDisconnect(session.getId());
    }
}
