package com.cybermodding.services;

import com.cybermodding.entities.User;
import com.cybermodding.payload.LoginDto;
import com.cybermodding.payload.RegisterDto;

public interface AuthService {
    public String login(LoginDto loginDto);

    public User register(RegisterDto registerDto);

    public boolean isMod(String username);

    public boolean isAdmin(String username);
}
