package com.cybermodding.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.cybermodding.entities.User;

public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByUsernameOrEmail(String username, String email);

    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    @Query("SELECT u FROM User u ORDER BY RANDOM() LIMIT 1")
    User getRandomUser();

    @Query("SELECT u FROM User u WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :uname, '%')) ORDER BY u.id ASC LIMIT 6")
    List<User> getFromNameLimit(String uname);
}
