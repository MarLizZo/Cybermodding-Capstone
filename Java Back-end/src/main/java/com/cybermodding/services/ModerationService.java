package com.cybermodding.services;

import java.util.Date;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.cybermodding.entities.User;
import com.cybermodding.payload.ModerateUserInDTO;
import com.cybermodding.payload.UserModerationData;
import com.cybermodding.repositories.RoleRepo;
import com.cybermodding.responses.CustomResponse;

@Service
public class ModerationService {
    @Autowired
    UserService u_svc;
    @Autowired
    RoleRepo roleRepository;

    public UserModerationData moderateUser(Long id, ModerateUserInDTO data) {
        User fromDB = u_svc.getById(data.getId());
        fromDB.setUsername(data.getUsername());
        fromDB.setEmail(data.getEmail());
        fromDB.setDescription(data.getDescription());
        fromDB.setRoles(data.getRoles());
        u_svc.updateUser(id, fromDB);
        return new UserModerationData(fromDB.getId(), fromDB.getUsername(), fromDB.getEmail(),
                fromDB.getRegistrationDate(), fromDB.getDescription(), fromDB.getAvatar(), fromDB.getBirthdate(),
                fromDB.getRoles(), fromDB.getPosts().size(), fromDB.getComments().size());
    }

    public CustomResponse banUser(Long id) {
        User u = u_svc.getById(id);
        u.setRoles(Set.of(roleRepository.findById(4l).get()));
        u_svc.updateUser(id, u);
        return new CustomResponse(new Date(), "** User Banned succesfully **",
                HttpStatus.OK);
    }
}
