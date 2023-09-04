package com.cybermodding.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.cybermodding.entities.Comment;

public interface CommentRepo extends JpaRepository<Comment, Long> {

    @Query("SELECT c FROM Comment c JOIN c.user cu WHERE cu.id = :id")
    public List<Comment> findByUserID(Long id);

    @Query("SELECT c FROM Comment c JOIN c.user cu WHERE cu.username = :username")
    public List<Comment> findByUsername(String username);

    @Query("SELECT c FROM Comment c WHERE c.publishedDate BETWEEN :start AND :end")
    public List<Comment> findByPublishedDateBetween(LocalDate start, LocalDate end);
}
