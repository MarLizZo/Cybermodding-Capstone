package com.cybermodding.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class PasswordUpdateDTO {
    private Long id;
    private String username;
    private String actual;
    private String repeatActual;
    private String newPassword;
    private String repeatNewPassword;
}
