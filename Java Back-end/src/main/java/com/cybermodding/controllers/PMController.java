package com.cybermodding.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cybermodding.entities.PrivateMessage;
import com.cybermodding.services.PMService;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping(value = "/api/pms")
public class PMController {
    @Autowired
    PMService svc;

    @GetMapping("/{id}")
    public ResponseEntity<List<PrivateMessage>> getPMs(@PathVariable Long id) {
        return ResponseEntity.ok(svc.getAllPerUser(id));
    }

    @GetMapping("/viewed/{id}")
    public ResponseEntity<PrivateMessage> markViewed(@PathVariable Long id) {
        return ResponseEntity.ok(svc.markAsViewed(id));
    }
}
