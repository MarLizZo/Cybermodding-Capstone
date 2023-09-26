package com.cybermodding.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.cybermodding.entities.PrivateMessage;

public interface PMRepo extends JpaRepository<PrivateMessage, Long> {

    @Query("SELECT p FROM PrivateMessage p WHERE p.sender_user.id = :userid OR p.recipient_user.id = :userid ORDER BY p.id DESC")
    public List<PrivateMessage> getAllPerUser(Long userid);
}
