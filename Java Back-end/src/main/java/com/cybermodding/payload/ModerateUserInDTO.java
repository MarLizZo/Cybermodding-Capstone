package com.cybermodding.payload;

import java.util.Set;

import com.cybermodding.entities.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class ModerateUserInDTO {
    private Long id;
    private String username;
    private String email;
    private String description;
    private Set<Role> roles;
}
