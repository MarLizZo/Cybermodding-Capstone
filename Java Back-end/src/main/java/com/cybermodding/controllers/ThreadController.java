package com.cybermodding.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cybermodding.entities.Post;
import com.cybermodding.entities.Reaction;
import com.cybermodding.payload.CommentInDTO;
import com.cybermodding.payload.CommentOutDTO;
import com.cybermodding.payload.CustomResponse;
import com.cybermodding.payload.PostDTO;
import com.cybermodding.payload.PostOutDTO;
import com.cybermodding.payload.ReactionDTO;
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

    @PostMapping("/react")
    public ResponseEntity<Reaction> addReaction(@RequestBody ReactionDTO react) {
        return ResponseEntity.ok(svc.addReaction(react));
    }

    @PutMapping("/react/{id}")
    public ResponseEntity<Reaction> updateReaction(@PathVariable Long id, @RequestBody Reaction react) {
        return ResponseEntity.ok(svc.updateReaction(id, react));
    }

    @DeleteMapping("/react/{id}")
    public ResponseEntity<CustomResponse> deleteReaction(@PathVariable Long id) {
        return ResponseEntity.ok(svc.removeReaction(id));
    }

    @PostMapping("/reply")
    public ResponseEntity<CommentOutDTO> postComment(@RequestBody CommentInDTO comm) {
        return ResponseEntity.ok(svc.addComment(comm));
    }

    @PostMapping("")
    public ResponseEntity<Post> postNewThread(@RequestBody PostDTO post) {
        return ResponseEntity.ok(svc.createNewPost(post));
    }
}
