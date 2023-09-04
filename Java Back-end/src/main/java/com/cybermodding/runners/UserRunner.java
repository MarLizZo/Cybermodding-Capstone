package com.cybermodding.runners;

import java.time.LocalDate;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.cybermodding.entities.ChatMessage;
import com.cybermodding.entities.Role;
import com.cybermodding.entities.User;
import com.cybermodding.enumerators.ERole;
import com.cybermodding.enumerators.EUserLevel;
import com.cybermodding.repositories.RoleRepo;
import com.cybermodding.repositories.UserRepo;
import com.cybermodding.services.AuthService;
import com.cybermodding.services.ChatService;
import com.cybermodding.services.UserService;
import com.github.javafaker.Faker;

@Component
public class UserRunner implements CommandLineRunner {

    @Autowired
    UserService svc;
    @Autowired
    RoleRepo roleRepository;
    @Autowired
    UserRepo userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    AuthService authService;
    @Autowired
    ChatService chatSvc;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("** ..Users Runner.. **");

        // create roles columns
        setRoleDefault();

        // add or edit user/s
        // User me = svc.getById(1l);
        // me.setRoles(Set.of(roleRepository.findById(3l).get()));
        // svc.updateUser(1l, me);

        // faker chat test
        // for (int i = 0; i < 50; i++) {
        // chatSvc.saveMessage(ChatMessage.builder().content(Faker.instance().lorem().paragraph())
        // .username(Faker.instance().funnyName().name()).date(LocalDate.now()).level(EUserLevel.BASE)
        // .build());
        // }
    }

    private void setRoleDefault() {
        Role user = new Role();
        user.setRoleName(ERole.ROLE_USER);
        if (!roleRepository.existsById(1l))
            roleRepository.save(user);

        Role moderator = new Role();
        moderator.setRoleName(ERole.ROLE_MODERATOR);
        if (!roleRepository.existsById(2l))
            roleRepository.save(moderator);

        Role admin = new Role();
        admin.setRoleName(ERole.ROLE_ADMIN);
        if (!roleRepository.existsById(3l))
            roleRepository.save(admin);
    }
}
