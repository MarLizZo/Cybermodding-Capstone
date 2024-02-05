package com.cybermodding.services;

import java.util.Date;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.cybermodding.entities.User;
import com.cybermodding.payload.ModerateUserInDTO;
import com.cybermodding.payload.UpdateUser;
import com.cybermodding.payload.UserModerationData;
import com.cybermodding.repositories.RoleRepo;
import com.cybermodding.repositories.UserRepo;
import com.cybermodding.responses.CustomResponse;
import com.cybermodding.responses.UserResponse;

@Service
public class ModerationService {
    @Autowired
    UserService u_svc;
    @Autowired
    UserRepo u_repo;
    @Autowired
    RoleRepo roleRepository;

    public UserModerationData moderateUser(Long id, ModerateUserInDTO data) {
        User fromDB = u_svc.getById(data.getId());
        UserResponse ur = u_svc.updateUser(id,
                new UpdateUser(fromDB.getId(), fromDB.getUsername(), fromDB.getEmail(), fromDB.getDescription(),
                        fromDB.getBirthdate()),
                data.getRoles());
        User fromDBUpd = u_svc.getById(data.getId());
        return new UserModerationData(ur.getId(), ur.getUsername(), ur.getEmail(),
                ur.getRegistrationDate(), ur.getDescription(), ur.getAvatar(), ur.getBirthdate(),
                fromDBUpd.getRoles(), fromDBUpd.getPosts().size(), fromDBUpd.getComments().size());
    }

    public CustomResponse banUser(Long id) {
        User u = u_svc.getById(id);
        u.setRoles(Set.of(roleRepository.findById(4l).get()));
        // u_svc.updateUser(id, u);
        u_repo.save(u);
        return new CustomResponse(new Date(), "** User Banned succesfully **",
                HttpStatus.OK);
    }
}
