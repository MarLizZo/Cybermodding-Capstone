package com.cybermodding.services;

import org.springframework.web.multipart.MultipartFile;

import com.cybermodding.entities.User;
import com.cybermodding.payload.LoginDto;
import com.cybermodding.payload.RegisterDto;

public interface AuthService {
    public String login(LoginDto loginDto);

    public User register(RegisterDto registerDto);

    public boolean isMod(String username);

    public boolean isAdmin(String username);

    public Long getIdFromName(String username);

    public boolean getIsTokenValid(String tk);

    public boolean userExists(String username);

    public String uploadAvatar(MultipartFile file);
}
