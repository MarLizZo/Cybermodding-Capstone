package com.cybermodding.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.cybermodding.entities.ChatMessage;

public interface ChatRepo extends JpaRepository<ChatMessage, Long> {

    @Query("SELECT c FROM ChatMessage c ORDER BY id DESC LIMIT 1")
    public ChatMessage getLast();

}
