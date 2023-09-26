package com.cybermodding.runners;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.cybermodding.entities.PrivateMessage;
import com.cybermodding.exception.CustomException;
import com.cybermodding.payload.PMDTO;
import com.cybermodding.repositories.UserRepo;
import com.cybermodding.services.PMService;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class WSPMsHandler extends TextWebSocketHandler {
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    UserRepo u_repo;
    @Autowired
    PMService pm_svc;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        //
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        PMDTO obj = objectMapper.readValue(payload, PMDTO.class);

        if (u_repo.existsById(obj.getSender_id()) &&
                u_repo.existsById(obj.getRecipient_id())) {
            PrivateMessage pm = PrivateMessage.builder().title(obj.getTitle()).content(obj.getContent())
                    .date(LocalDateTime.now()).sender_user(u_repo.findById(obj.getSender_id()).get())
                    .recipient_user(u_repo.findById(obj.getRecipient_id()).get()).build();

            pm_svc.saveNewPM(pm);
            System.out.println("Ricevuto e salvato - ID:" + pm.getId() + " Title: " + pm.getTitle());

            TextMessage stringifiedMsg = new TextMessage(objectMapper
                    .writeValueAsString(pm));
            session.sendMessage(stringifiedMsg);
        } else {
            throw new CustomException(HttpStatus.BAD_REQUEST, "** Sender or recipient not found **");
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        //
    }
}
