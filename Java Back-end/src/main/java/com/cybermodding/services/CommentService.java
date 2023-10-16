package com.cybermodding.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.cybermodding.entities.Comment;
import com.cybermodding.exception.CustomException;
import com.cybermodding.repositories.CommentRepo;
import com.cybermodding.repositories.UserRepo;
import com.cybermodding.responses.CommentResponse;
import com.cybermodding.responses.CustomResponse;
import com.cybermodding.responses.ResponseBase;

@Service
public class CommentService {
    @Autowired
    CommentRepo repo;
    @Autowired
    UserRepo u_repo;

    public CommentResponse getById(Long id) {
        if (repo.existsById(id)) {
            Comment c = repo.findById(id).get();
            return new CommentResponse(new ResponseBase(true, "", LocalDateTime.now()), c.getId(), c.getContent(),
                    c.getUser(), c.getPost(), c.getPublishedDate());
        } else {
            return new CommentResponse(new ResponseBase(false, "** Comment not found **", LocalDateTime.now()), null,
                    null, null, null, null);
        }
    }

    public List<Comment> getAll() {
        return repo.findAll();
    }

    public List<Comment> getAllByUserId(Long id) {
        if (u_repo.existsById(id)) {
            return repo.findByUserID(id);
        } else {
            throw new CustomException(HttpStatus.BAD_REQUEST, "** User not found **");
        }
    }

    public List<Comment> getAllByUsername(String username) {
        if (u_repo.existsByUsername(username)) {
            return repo.findByUsername(username);
        } else {
            throw new CustomException(HttpStatus.BAD_REQUEST, "** Comment not found **");
        }
    }

    public List<Comment> getAllByDateBetween(LocalDate start, LocalDate end) {
        return repo.findByPublishedDateBetween(start, end);
    }

    public CommentResponse saveComment(Comment c) {
        Comment savedC = repo.save(c);
        if (savedC.getId() != null) {
            return new CommentResponse(new ResponseBase(true, "", LocalDateTime.now()), savedC.getId(),
                    savedC.getContent(), savedC.getUser(), savedC.getPost(), savedC.getPublishedDate());
        } else {
            return new CommentResponse(new ResponseBase(false, "** Unexpected error **", LocalDateTime.now()), null,
                    null, null, null, null);
        }
    }

    public CommentResponse updateComment(Long id, Comment c) {
        if (repo.existsById(id)) {
            if (id.equals(c.getId())) {
                Comment com = repo.save(c);
                return new CommentResponse(
                        new ResponseBase(true, "** Comment updated correctly **", LocalDateTime.now()), com.getId(),
                        com.getContent(), com.getUser(), com.getPost(), com.getPublishedDate());
            } else {
                return new CommentResponse(
                        new ResponseBase(true, "** Input ID and Comment ID does not match **", LocalDateTime.now()),
                        null, null, null, null, null);
            }
        } else {
            return new CommentResponse(new ResponseBase(true, "** Comment not found **", LocalDateTime.now()), null,
                    null, null, null, null);
        }
    }

    public CustomResponse deleteById(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return new CustomResponse(new Date(), "** Comment deleted succesfully **", HttpStatus.OK);
        } else {
            return new CustomResponse(new Date(), "** Comment not found **", HttpStatus.NOT_FOUND);
        }
    }
}
