package com.cybermodding.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cybermodding.entities.ChatMessage;
import com.cybermodding.services.ChatService;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping(value = "/api/chatbox")
public class ChatController {

    @Autowired
    ChatService svc;

    @GetMapping("/getmsgs")
    public ResponseEntity<List<ChatMessage>> getInitMessages() {
        return ResponseEntity.ok(svc.getInitMsg());
    }
}
