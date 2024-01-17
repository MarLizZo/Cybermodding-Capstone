package com.cybermodding.services;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cybermodding.entities.Role;
import com.cybermodding.entities.User;
import com.cybermodding.enumerators.ERole;
import com.cybermodding.exception.CustomException;
import com.cybermodding.payload.LoginDto;
import com.cybermodding.payload.RegisterDto;
import com.cybermodding.repositories.RoleRepo;
import com.cybermodding.repositories.UserRepo;
import com.cybermodding.security.JwtTokenProvider;

@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    FTPUploadService ftpSvc;

    AuthenticationManager authenticationManager;
    PasswordEncoder passwordEncoder;
    private UserRepo userRepository;
    private RoleRepo roleRepository;
    private JwtTokenProvider jwtTokenProvider;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
            UserRepo userRepository,
            RoleRepo roleRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public String login(LoginDto loginDto) {

        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);

        return token;
    }

    public String uploadAvatar(MultipartFile file) {
        return ftpSvc.uploadAvatar(file, "Username", true);
    }

    @Override
    public User register(RegisterDto registerDto) {

        // check if username exists in database
        if (userRepository.existsByUsername(registerDto.getUsername())) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "** Username already exists **");
        }

        // check if email exists in database
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "** Email already exists **");
        }

        if (!registerDto.getTmpPaths().isEmpty()) {
            String[] arr = registerDto.getTmpPaths().split(",");
            if (ftpSvc.deleteFile(Arrays.asList(arr))) {
                System.out.println("Temp folder cleanup ok");
            }
        }

        String avatarPath = null;
        if (registerDto.getAvatar() != null) {
            avatarPath = ftpSvc.uploadAvatar(registerDto.getAvatar(), registerDto.getUsername(), false);
        }

        User user = new User();
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setDescription(registerDto.getDescription());
        user.setBirthdate(registerDto.getBirthdate());
        user.setRegistrationDate(LocalDate.now());
        user.setAvatar(avatarPath);

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByRoleName(ERole.ROLE_USER).get();
        roles.add(userRole);

        user.setRoles(roles);
        return userRepository.save(user);
    }

    public boolean isMod(String username) {
        User u = userRepository.findByUsername(username).get();
        return u.getRoles().stream().anyMatch(r -> r.getRoleName().equals(ERole.ROLE_MODERATOR));
    }

    public boolean isAdmin(String username) {
        User u = userRepository.findByUsername(username).get();
        return u.getRoles().stream().anyMatch(r -> r.getRoleName().equals(ERole.ROLE_ADMIN));
    }

    public Long getIdFromName(String username) {
        Optional<User> u = userRepository.findByUsername(username);
        return u.isPresent() ? u.get().getId() : null;
    }

    public boolean getIsTokenValid(String tk) {
        return this.jwtTokenProvider.validateToken(tk);
    }

    public boolean userExists(String username) {
        return userRepository.existsByUsername(username);
    }

    public ERole getRole(String role) {
        if (role.equals("ADMIN"))
            return ERole.ROLE_ADMIN;
        else if (role.equals("MODERATOR"))
            return ERole.ROLE_MODERATOR;
        else
            return ERole.ROLE_USER;
    }
}
