package com.cybermodding.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cybermodding.entities.User;
import com.cybermodding.payload.CustomResponse;
import com.cybermodding.services.UserService;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserService u_svc;

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return new ResponseEntity<User>(u_svc.getById(id), HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User u) {
        return u_svc.updateUser(id, u);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CustomResponse> deleteUser(@PathVariable Long id) {
        return u_svc.deleteById(id);
    }

    @GetMapping("")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<User>> getUsersPage(Pageable pageable) {
        Page<User> p = u_svc.getUsersPagination(pageable);
        return new ResponseEntity<Page<User>>(p, HttpStatus.OK);
    }
}
