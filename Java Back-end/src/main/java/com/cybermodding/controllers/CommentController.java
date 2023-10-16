package com.cybermodding.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cybermodding.entities.Comment;
import com.cybermodding.exception.CustomException;
import com.cybermodding.responses.CommentResponse;
import com.cybermodding.responses.CustomResponse;
import com.cybermodding.services.CommentService;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(value = "*", maxAge = 3600)
public class CommentController {
    @Autowired
    CommentService svc;

    @GetMapping("/{id}")
    public ResponseEntity<CommentResponse> getById(@PathVariable Long id) {
        return new ResponseEntity<CommentResponse>(svc.getById(id), HttpStatus.OK);
    }

    @GetMapping("")
    public ResponseEntity<List<Comment>> getAll(@RequestParam(defaultValue = "") String u_id,
            @RequestParam(defaultValue = "") String u_name) {
        if (u_id.isEmpty() && u_name.isEmpty()) {
            return ResponseEntity.ok(svc.getAll());
        } else if (!u_id.isEmpty()) {
            try {
                return ResponseEntity.ok(svc.getAllByUserId(Long.valueOf(u_id)));
            } catch (NumberFormatException ex) {
                throw new CustomException(HttpStatus.BAD_REQUEST, "** Incorrect parameter **");
            }
        } else {
            return ResponseEntity.ok(svc.getAllByUsername(u_name));
        }
    }

    @PostMapping("/new")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentResponse> createNewComment(@RequestBody Comment c) {
        return new ResponseEntity<CommentResponse>(svc.saveComment(c), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentResponse> updateComment(@PathVariable Long id, @RequestBody Comment c) {
        return new ResponseEntity<CommentResponse>(svc.updateComment(id, c), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CustomResponse> deleteComment(@PathVariable Long id) {
        return new ResponseEntity<CustomResponse>(svc.deleteById(id), HttpStatus.OK);
    }
}
