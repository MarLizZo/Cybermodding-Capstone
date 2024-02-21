package com.cybermodding.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.cybermodding.entities.Post;

public interface PostRepo extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p WHERE sub_section.id = :ssid ORDER BY p.id DESC")
    List<Post> findAllBySubSId(Long ssid);

    @Query("SELECT p FROM Post p ORDER BY RANDOM() LIMIT 1")
    Post getRandom();

    @Query("SELECT p FROM Post p JOIN p.comments pc WHERE YEAR(p.publishedDate) = :year ORDER BY COUNT(pc) LIMIT :limit")
    List<Post> getTenMoreActive(Integer year, Integer limit);

    @Query("SELECT p.publishedDate FROM Post p WHERE YEAR(p.publishedDate) = :year")
    List<LocalDateTime> getDatesFromPostCreation(Integer year);
}
