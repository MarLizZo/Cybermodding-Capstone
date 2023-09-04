package com.cybermodding.runners;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.cybermodding.entities.ChatMessage;
import com.cybermodding.enumerators.EUserLevel;
import com.cybermodding.services.ChatService;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    ChatService svc;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {

    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        ChatMessage webSocketMessage = objectMapper.readValue(payload, ChatMessage.class);

        // Ora puoi accedere alle proprietà dell'oggetto WebSocketMessage
        String user = webSocketMessage.getUsername();
        String content = webSocketMessage.getContent();
        LocalDate date = webSocketMessage.getDate();
        EUserLevel level = webSocketMessage.getLevel();

        ChatMessage savedMsg = svc
                .saveMessage(ChatMessage.builder().username(user).content(content).date(date).level(level).build());

        System.out.println("Saved message: " + savedMsg.toString());

        TextMessage txtMessage = new TextMessage(objectMapper.writeValueAsString(savedMsg));
        session.sendMessage(txtMessage);
        svc.cleanDB();
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {

    }
}
