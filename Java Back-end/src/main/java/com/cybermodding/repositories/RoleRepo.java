package com.cybermodding.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cybermodding.entities.Role;
import com.cybermodding.enumerators.ERole;

public interface RoleRepo extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleName(ERole roleName);
}
