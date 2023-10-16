package com.cybermodding.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class JWTAuthResponse {
    private String username;
    private Long user_id;
    private String accessToken;
    private String tokenType = "Bearer";
}
