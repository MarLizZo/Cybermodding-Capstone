package com.cybermodding.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import com.cybermodding.entities.User;

public interface UserPageRepo extends PagingAndSortingRepository<User, Long> {

    @Query("SELECT u FROM User u WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<User> findAllByUsername(String name, Pageable pageable);
}
