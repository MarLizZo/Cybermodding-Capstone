package com.cybermodding.services;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.cybermodding.entities.ChatMessage;
import com.cybermodding.exception.CustomException;
import com.cybermodding.payload.ChatMsgDTO;
import com.cybermodding.repositories.ChatRepo;
import com.cybermodding.responses.CustomResponse;

@Service
public class ChatService {
    @Autowired
    ChatRepo repo;

    public ChatMsgDTO convertToDTO(ChatMessage msg) {
        return ChatMsgDTO.builder().username(msg.getUser().getUsername()).user_id(msg.getUser().getId())
                .content(msg.getContent()).level(msg.getLevel()).date(msg.getDate()).build();
    }

    public ChatMessage getById(Long id) {
        if (repo.existsById(id)) {
            return repo.findById(id).get();
        } else {
            throw new CustomException(HttpStatus.NOT_FOUND, "** Message not found **");
        }
    }

    public List<ChatMsgDTO> getInitMsg() {
        List<ChatMessage> chatMsg = repo.findAllInitOrder();
        List<ChatMsgDTO> ls = new ArrayList<>();
        chatMsg.stream().forEach(m -> ls.add(convertToDTO(m)));
        return ls;
    }

    public ChatMessage saveMessage(ChatMessage m) {
        return repo.save(m);
    }

    public CustomResponse deleteById(Long msg_id, Long user_id) {
        if (repo.existsById(msg_id)) {
            // check if admin or user authorized
            // repo.deleteById(id);
            return new CustomResponse(new Date(), "** Message deleted succesfully **", HttpStatus.OK);
        } else {
            throw new CustomException(HttpStatus.NOT_FOUND, "** Message not found **");
        }
    }

    public void cleanDB() {
        // cleanup da chiamare ad intervalli regolari
        // gli ultimi 50 messaggi saranno gli unici a restare salvati nel DB,
        // mentre gli altri vengono eliminati per non appesantire il database
        if (repo.getLast() != null) {
            if (repo.getLast().getId() > 50l) {
                List<ChatMessage> ls = repo.findAll();
                ChatMessage[] arr = (ChatMessage[]) ls.toArray(new ChatMessage[ls.size()]);
                List<ChatMessage> toDeleteMsgs = ls.stream()
                        .filter(msg -> msg.getId() < arr[arr.length - 1].getId() - 50l)
                        .collect(Collectors.toList());

                toDeleteMsgs.forEach(m -> repo.deleteById(m.getId()));
            }
        }
    }
}
