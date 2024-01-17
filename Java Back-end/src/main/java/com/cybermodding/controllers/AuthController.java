package com.cybermodding.controllers;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cybermodding.entities.User;
import com.cybermodding.payload.LoginDto;
import com.cybermodding.payload.PingDto;
import com.cybermodding.payload.RegisterDto;
import com.cybermodding.responses.AvatarRes;
import com.cybermodding.responses.JWTAuthResponse;
import com.cybermodding.responses.ResponseBase;
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
    public ResponseEntity<User> register(@RequestParam("username") String username,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("description") String description,
            @RequestParam("birthdate") LocalDate birthdate,
            @RequestParam("tmpPaths") String tmpPaths) {
        RegisterDto regDto = new RegisterDto(username, email, password, description, null, birthdate, tmpPaths);
        User response = authService.register(regDto);
        return new ResponseEntity<User>(response, HttpStatus.CREATED);
    }

    @PostMapping("/registerWAv")
    public ResponseEntity<User> registerWithAvatar(@RequestParam("username") String username,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("description") String description,
            @RequestParam("avatar") MultipartFile avatar,
            @RequestParam("birthdate") LocalDate birthdate,
            @RequestParam("tmpPaths") String tmpPaths) {
        RegisterDto regDto = new RegisterDto(username, email, password, description, avatar, birthdate, tmpPaths);
        User response = authService.register(regDto);
        return new ResponseEntity<User>(response, HttpStatus.CREATED);
    }

    @PostMapping("/avatarTest")
    public ResponseEntity<AvatarRes> avatarPreview(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity
                    .ok(new AvatarRes(new ResponseBase(false, "** Invalid File **", LocalDateTime.now()), null));
        } else {
            String link = authService.uploadAvatar(file);
            if (link == null) {
                return ResponseEntity
                        .ok(new AvatarRes(new ResponseBase(false, "** Upload error **", LocalDateTime.now()), null));
            }
            return ResponseEntity
                    .ok(new AvatarRes(new ResponseBase(true, "", LocalDateTime.now()), link));
        }
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
