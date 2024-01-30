package com.cybermodding.services;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.cybermodding.entities.Comment;
import com.cybermodding.exception.CustomException;
import com.cybermodding.factory.PostsFactory;
import com.cybermodding.repositories.CommentRepo;
import com.cybermodding.repositories.UserRepo;
import com.cybermodding.responses.CommentResponse;
import com.cybermodding.responses.CustomResponse;

@Service
@SuppressWarnings("null")
public class CommentService {
    @Autowired
    CommentRepo repo;
    @Autowired
    UserRepo u_repo;

    public CommentResponse getById(Long id) {
        if (repo.existsById(id)) {
            Comment c = repo.findById(id).get();
            return PostsFactory.getCommentResponse("", c);
        } else {
            return PostsFactory.getCommentResponse("** Comment not found **", null);
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
        try {
            return PostsFactory.getCommentResponse("", repo.save(c));
        } catch (IllegalArgumentException ex) {
            return PostsFactory.getCommentResponse("** Campi obbligatori mancanti **", null);
        } catch (Exception ex) {
            return PostsFactory.getCommentResponse("** Unexpected error **", null);
        }
    }

    public CommentResponse updateComment(Long id, Comment c) {
        if (repo.existsById(id)) {
            if (id.equals(c.getId())) {
                Comment com = repo.save(c);
                return PostsFactory.getCommentResponse("", repo.save(com));
            } else {
                return PostsFactory.getCommentResponse("** Input ID and Comment ID does not match **", null);
            }
        } else {
            return PostsFactory.getCommentResponse("** Comment not found **", null);
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
