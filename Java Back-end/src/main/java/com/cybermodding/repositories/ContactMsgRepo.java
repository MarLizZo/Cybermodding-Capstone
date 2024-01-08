package com.cybermodding.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.cybermodding.entities.ContactMessage;
import com.cybermodding.enumerators.ContactMsgType;

public interface ContactMsgRepo extends JpaRepository<ContactMessage, Long> {

    @Query("SELECT m FROM ContactMessage m WHERE m.fromUser.id = :id")
    public List<ContactMessage> findByUserID(Long id);

    @Query("SELECT m FROM ContactMessage m WHERE m.date BETWEEN :start AND :end")
    public List<ContactMessage> findByDateBetween(LocalDateTime start, LocalDateTime end);

    public List<ContactMessage> findByType(ContactMsgType type);
}
