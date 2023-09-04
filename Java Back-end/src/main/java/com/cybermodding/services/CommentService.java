package com.cybermodding.services;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.cybermodding.entities.Comment;
import com.cybermodding.exception.MyAPIException;
import com.cybermodding.payload.CustomResponse;
import com.cybermodding.repositories.CommentRepo;
import com.cybermodding.repositories.UserRepo;

@Service
public class CommentService {
    @Autowired
    CommentRepo repo;
    @Autowired
    UserRepo u_repo;

    public Comment getById(Long id) {
        if (repo.existsById(id)) {
            return repo.findById(id).get();
        } else {
            throw new MyAPIException(HttpStatus.BAD_REQUEST, "** Comment not found **");
        }
    }

    public List<Comment> getAll() {
        return repo.findAll();
    }

    public List<Comment> getAllByUserId(Long id) {
        if (u_repo.existsById(id)) {
            return repo.findByUserID(id);
        } else {
            throw new MyAPIException(HttpStatus.BAD_REQUEST, "** User not found **");
        }
    }

    public List<Comment> getAllByUsername(String username) {
        if (u_repo.existsByUsername(username)) {
            return repo.findByUsername(username);
        } else {
            throw new MyAPIException(HttpStatus.BAD_REQUEST, "** Comment not found **");
        }
    }

    public List<Comment> getAllByDateBetween(LocalDate start, LocalDate end) {
        return repo.findByPublishedDateBetween(start, end);
    }

    public Comment saveComment(Comment c) {
        Comment savedC = repo.save(c);
        return savedC;
    }

    public CustomResponse updateComment(Long id, Comment c) {
        if (repo.existsById(id)) {
            if (id.equals(c.getId())) {
                repo.save(c);
                return new CustomResponse(new Date(), "** Comment updated succesfully **", HttpStatus.OK);
            } else {
                return new CustomResponse(new Date(), "** Input ID and Comment ID does not match **",
                        HttpStatus.BAD_REQUEST);
            }
        } else {
            throw new MyAPIException(HttpStatus.BAD_REQUEST, "** Comment not found **");
        }
    }

    public CustomResponse deleteById(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return new CustomResponse(new Date(), "** Comment deleted succesfully **", HttpStatus.OK);
        } else {
            throw new MyAPIException(HttpStatus.BAD_REQUEST, "** Comment not found **");
        }
    }
}
