package com.cybermodding.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cybermodding.entities.Reaction;

public interface ReactionRepo extends JpaRepository<Reaction, Long> {

}
