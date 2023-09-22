package com.cybermodding.controllers;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
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

import com.cybermodding.entities.Post;
import com.cybermodding.entities.Reaction;
import com.cybermodding.payload.CommentInDTO;
import com.cybermodding.payload.CommentOutDTO;
import com.cybermodding.payload.CustomResponse;
import com.cybermodding.payload.PostDTO;
import com.cybermodding.payload.PostHome;
import com.cybermodding.payload.PostOutDTOCPaged;
import com.cybermodding.payload.ReactionDTO;
import com.cybermodding.payload.UpdatePostDTO;
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
    public ResponseEntity<PostOutDTOCPaged> getById(@PathVariable Long id, Pageable page) {
        return ResponseEntity.ok(svc.getPostOut(id, page));
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<PostHome>> getPagedPosts(@RequestParam String by,
            @RequestParam(defaultValue = "") String param,
            @RequestParam(defaultValue = "") String paramtwo, Pageable page) {
        if (by.equals("title")) {
            return ResponseEntity.ok(svc.getPagedByTitle(param, page));
        } else if (by.equals("user")) {
            return ResponseEntity.ok(svc.getPagedByUsername(param, page));
        } else {
            try {
                return ResponseEntity
                        .ok(svc.getPagedByDate(LocalDateTime.parse(param), LocalDateTime.parse(paramtwo), page));
            } catch (Exception ex) {
                return ResponseEntity.ok(Page.empty());
            }
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@RequestBody UpdatePostDTO data) {
        return ResponseEntity.ok(svc.updatePost(data));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CustomResponse> deleteComment(@PathVariable Long id) {
        return ResponseEntity.ok(svc.deleteComment(id));
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

    @GetMapping("/home/{id}")
    public ResponseEntity<Page<PostHome>> getPostsHome(@PathVariable Long id,
            @RequestParam(name = "orderBy", defaultValue = "date") String orderBy, Pageable page) {
        if (String.valueOf(id).equals("0")) {
            if (orderBy.equals("react")) {
                return ResponseEntity.ok(svc.getAllPostsPagedReact(page));
            } else if (orderBy.equals("comments")) {
                return ResponseEntity.ok(svc.getAllPostsPagedComments(page));
            } else {
                return ResponseEntity.ok(svc.getAllPostsPaged(page));
            }
        } else {
            if (orderBy.equals("react")) {
                return ResponseEntity.ok(svc.getPostsForHomeOrderReact(id, page));
            } else if (orderBy.equals("comments")) {
                return ResponseEntity.ok(svc.getPostsForHomeOrderComments(id, page));
            } else {
                return ResponseEntity.ok(svc.getPostsForHomeOrderDate(id, page));
            }
        }
    }
}
