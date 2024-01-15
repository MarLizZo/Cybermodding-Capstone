package com.cybermodding.payload;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUser {
    private Long id;
    private String username;
    private String email;
    private String description;
    private LocalDate birthdate;
}
