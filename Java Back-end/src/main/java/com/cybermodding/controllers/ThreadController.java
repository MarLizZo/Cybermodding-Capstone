package com.cybermodding.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cybermodding.payload.PostOutDTO;
import com.cybermodding.services.PostService;
import com.cybermodding.services.UserService;

@RestController
@RequestMapping("/api/threads")
@CrossOrigin(value = "*", maxAge = 3600)
public class ThreadController {

    @Autowired
    PostService svc;
    @Autowired
    UserService u_svc;

    @GetMapping("/{id}")
    public ResponseEntity<PostOutDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(svc.getPostOut(id));
    }
}
