package com.cybermodding.services;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.cybermodding.entities.ChatMessage;
import com.cybermodding.exception.MyAPIException;
import com.cybermodding.payload.CustomResponse;
import com.cybermodding.repositories.ChatRepo;

@Service
public class ChatService {
    @Autowired
    ChatRepo repo;

    public ChatMessage getById(Long id) {
        if (repo.existsById(id)) {
            return repo.findById(id).get();
        } else {
            throw new MyAPIException(HttpStatus.BAD_REQUEST, "** Message not found **");
        }
    }

    public List<ChatMessage> getInitMsg() {
        return repo.findAll();
    }

    public ChatMessage saveMessage(ChatMessage m) {
        return repo.save(m);
    }

    public CustomResponse deleteById(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return new CustomResponse(new Date(), "** Message deleted succesfully **", HttpStatus.OK);
        } else {
            throw new MyAPIException(HttpStatus.BAD_REQUEST, "** Message not found **");
        }
    }

    public void cleanDB() {
        Long lastElement = repo.getLast().getId();
        if (lastElement > 50l) {
            Long toDelete = lastElement - 50l;
            repo.deleteById(toDelete);
        }
    }
}
