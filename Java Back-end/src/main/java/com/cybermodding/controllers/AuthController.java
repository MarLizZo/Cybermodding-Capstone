package com.cybermodding.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cybermodding.entities.User;
import com.cybermodding.payload.JWTAuthResponse;
import com.cybermodding.payload.LoginDto;
import com.cybermodding.payload.PingDto;
import com.cybermodding.payload.RegisterDto;
import com.cybermodding.services.AuthService;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/auth")
public class AuthController {

    private AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<JWTAuthResponse> login(@RequestBody LoginDto loginDto) {

        String token = authService.login(loginDto);

        JWTAuthResponse jwtAuthResponse = new JWTAuthResponse();
        String priv = authService.isAdmin(loginDto.getUsername()) ? "9s"
                : authService.isMod(loginDto.getUsername()) ? "2b" : "1a";
        jwtAuthResponse.setUsername(loginDto.getUsername());
        jwtAuthResponse.setAccessToken(token + priv);
        jwtAuthResponse.setUser_id(authService.getIdFromName(loginDto.getUsername()));

        return ResponseEntity.ok(jwtAuthResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterDto registerDto) {
        User response = authService.register(registerDto);
        return new ResponseEntity<User>(response, HttpStatus.CREATED);
    }

    @GetMapping("/ping")
    public ResponseEntity<PingDto> tokenPing(@RequestParam String u, @RequestParam String t) {
        boolean tkValid = authService.getIsTokenValid(t) ? true : false;
        boolean exists = authService.userExists(u) ? true : false;
        boolean result = tkValid && exists ? true : false;
        PingDto ping = new PingDto(result);
        return ResponseEntity.ok(ping);
    }
}
