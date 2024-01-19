package com.cybermodding.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import com.cybermodding.entities.Comment;

public interface CommentRepoPage extends PagingAndSortingRepository<Comment, Long> {

    @Query("SELECT c FROM Comment c JOIN c.post cp WHERE cp.id = :pid")
    public Page<Comment> findAllByPostId(Long pid, Pageable page);

    @Query("SELECT c FROM Comment c WHERE LOWER(c.content) LIKE %:str%")
    public Page<Comment> findAllByBodyPart(String str, Pageable page);
}
