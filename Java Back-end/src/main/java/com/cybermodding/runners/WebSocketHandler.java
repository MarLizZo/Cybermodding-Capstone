package com.cybermodding.runners;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.cybermodding.entities.ChatMessage;
import com.cybermodding.entities.User;
import com.cybermodding.enumerators.EUserLevel;
import com.cybermodding.exception.CustomException;
import com.cybermodding.payload.ChatMsgDTO;
import com.cybermodding.repositories.UserRepo;
import com.cybermodding.services.ChatService;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    ChatService svc;
    @Autowired
    UserRepo u_repo;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        //
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        ChatMsgDTO webSocketMessage = objectMapper.readValue(payload, ChatMsgDTO.class);

        if (u_repo.existsById(webSocketMessage.getUser_id())) {
            User user = u_repo.findById(webSocketMessage.getUser_id()).get();
            String content = webSocketMessage.getContent();
            LocalDate date = webSocketMessage.getDate();
            EUserLevel level = webSocketMessage.getLevel();

            ChatMessage savedMsg = svc
                    .saveMessage(ChatMessage.builder().user(user).content(content).date(date).level(level).build());

            ChatMsgDTO outMsg = new ChatMsgDTO(savedMsg.getContent(), savedMsg.getUser().getUsername(),
                    savedMsg.getUser().getId(), savedMsg.getLevel(), LocalDate.now());

            TextMessage stringifiedMsg = new TextMessage(objectMapper.writeValueAsString(outMsg));
            session.sendMessage(stringifiedMsg);
            svc.cleanDB();
        } else {
            throw new CustomException(HttpStatus.BAD_REQUEST, "** User not found **");
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        //
    }
}
