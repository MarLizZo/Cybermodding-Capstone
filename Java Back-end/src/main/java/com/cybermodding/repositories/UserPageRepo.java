package com.cybermodding.repositories;

import org.springframework.data.repository.PagingAndSortingRepository;

import com.cybermodding.entities.User;

public interface UserPageRepo extends PagingAndSortingRepository<User, Long> {

}
