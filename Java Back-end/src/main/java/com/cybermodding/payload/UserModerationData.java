package com.cybermodding.payload;

import java.time.LocalDate;
import java.util.Set;

import com.cybermodding.entities.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserModerationData {
    private Long id;
    private String username;
    private String email;
    private LocalDate registrationDate;
    private String description;
    private String avatar;
    private LocalDate birthdate;
    private Set<Role> roles;
    private Integer post_count;
    private Integer comments_count;
}
