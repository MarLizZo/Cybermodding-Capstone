package com.cybermodding.repositories;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.cybermodding.entities.ChatMessage;

public interface ChatRepo extends JpaRepository<ChatMessage, Long> {

    @Query("SELECT c FROM ChatMessage c ORDER BY id DESC LIMIT 1")
    public ChatMessage getLast();

    @Query("SELECT c FROM ChatMessage c ORDER BY id DESC LIMIT 50")
    public Set<ChatMessage> findAllOrdered();

    @Query("SELECT c FROM ChatMessage c ORDER BY id ASC")
    public List<ChatMessage> findAllInitOrder();
}
