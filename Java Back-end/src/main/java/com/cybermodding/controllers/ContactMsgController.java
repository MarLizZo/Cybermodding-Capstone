package com.cybermodding.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cybermodding.entities.ContactMessage;
import com.cybermodding.payload.ContactMessageDTO;
import com.cybermodding.responses.ContactMsgResponse;
import com.cybermodding.services.ContactMsgService;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin(value = "*", maxAge = 3600)
public class ContactMsgController {
    @Autowired
    ContactMsgService svc;

    @PostMapping("/new")
    public ResponseEntity<ContactMsgResponse> newMessage(@RequestBody ContactMessageDTO dto) {
        return ResponseEntity.ok(svc.createNewMessage(dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ContactMsgResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(svc.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("")
    public ResponseEntity<List<ContactMessage>> getAll() {
        return ResponseEntity.ok(svc.getAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/close/{id}")
    public ResponseEntity<ContactMsgResponse> setClose(@PathVariable Long id) {
        return ResponseEntity.ok(svc.setMessageAsClosed(id));
    }
}
