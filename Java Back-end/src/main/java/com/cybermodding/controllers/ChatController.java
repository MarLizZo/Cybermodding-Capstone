package com.cybermodding.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cybermodding.entities.ChatMessage;
import com.cybermodding.payload.ChatMsgDTO;
import com.cybermodding.payload.CustomResponse;
import com.cybermodding.services.ChatService;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping(value = "/api/chatbox")
public class ChatController {

    @Autowired
    ChatService svc;

    @GetMapping("/getmsgs")
    public ResponseEntity<List<ChatMsgDTO>> getInitMessages() {
        return ResponseEntity.ok(svc.getInitMsg());
    }

    @DeleteMapping("/msg")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CustomResponse> deleteMessage(@RequestParam String mid, @RequestParam String uid) {
        return ResponseEntity.ok(svc.deleteById(Long.getLong(mid), Long.getLong(uid)));
    }
}
