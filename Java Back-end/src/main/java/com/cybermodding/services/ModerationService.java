package com.cybermodding.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cybermodding.entities.Role;
import com.cybermodding.entities.User;
import com.cybermodding.enumerators.ERole;
import com.cybermodding.payload.ModerateUserInDTO;
import com.cybermodding.payload.UpdateUser;
import com.cybermodding.repositories.CommentRepo;
import com.cybermodding.repositories.PostRepo;
import com.cybermodding.repositories.RoleRepo;
import com.cybermodding.repositories.UserRepo;
import com.cybermodding.responses.ResponseBase;
import com.cybermodding.responses.UserModerationData;
import com.cybermodding.responses.UserResponse;

@Service
@SuppressWarnings("null")
public class ModerationService {
        @Autowired
        UserService u_svc;
        @Autowired
        UserRepo u_repo;
        @Autowired
        RoleRepo roleRepository;
        @Autowired
        PostRepo p_repo;
        @Autowired
        CommentRepo c_repo;

        public UserModerationData moderateUser(Long id, ModerateUserInDTO data) {
                User fromDB = u_svc.getById(data.getId());
                UserResponse ur = u_svc.updateUser(id,
                                new UpdateUser(data.getId(), data.getUsername(), data.getEmail(), data.getDescription(),
                                                fromDB.getBirthdate()),
                                data.getRoles());
                User fromDBUpd = u_svc.getById(data.getId());
                if (ur.getResponse().getOk()) {
                        return new UserModerationData(ur.getResponse(), ur.getId(), ur.getUsername(), ur.getEmail(),
                                        ur.getRegistrationDate(), ur.getDescription(), ur.getAvatar(),
                                        ur.getBirthdate(),
                                        fromDBUpd.getRoles(), fromDBUpd.getPosts().size(),
                                        fromDBUpd.getComments().size());
                } else {
                        return new UserModerationData(ur.getResponse(), null, null, null,
                                        null, null, null, null,
                                        null, 0, 0);
                }
        }

        public List<LocalDate> getRegDatesForYear(Integer year) {
                return u_repo.getRegisteredDatesInYear(year);
        }

        public UserModerationData banUser(Long id) {
                if (u_repo.existsById(id)) {
                        if (!id.equals(1l) && !id.equals(87l)) {
                                User u = u_svc.getById(id);
                                Set<Role> roles = new HashSet<>();
                                Role userRole = roleRepository.findByRoleName(ERole.ROLE_BANNED).get();
                                roles.add(userRole);
                                u.setRoles(roles);
                                u_repo.save(u);
                                return new UserModerationData(new ResponseBase(true, "", LocalDateTime.now()),
                                                u.getId(), u.getUsername(), u.getEmail(),
                                                null, null, null, null,
                                                u.getRoles(), u.getPosts().size(), u.getComments().size());
                        } else {
                                return new UserModerationData(
                                                new ResponseBase(false, "** Undeletable users **", LocalDateTime.now()),
                                                null, null, null,
                                                null, null, null, null,
                                                null, 0, 0);
                        }
                } else {
                        return new UserModerationData(
                                        new ResponseBase(false, "** User not found **", LocalDateTime.now()), null,
                                        null, null,
                                        null, null, null, null,
                                        null, 0, 0);
                }
        }

        public UserModerationData getSingleUserFUsername(String username) {
                User u = u_repo.findByUsernameNoCaseSens(username);
                if (u != null) {
                        return new UserModerationData(new ResponseBase(true, "", LocalDateTime.now()),
                                        u.getId(), u.getUsername(), u.getEmail(),
                                        u.getRegistrationDate(), u.getDescription(), null,
                                        u.getBirthdate(),
                                        u.getRoles(), u.getPosts().size(), u.getComments().size());
                }
                return new UserModerationData(
                                new ResponseBase(false, "** User not found **", LocalDateTime.now()), null,
                                null, null,
                                null, null, null, null,
                                null, 0, 0);
        }

        public List<LocalDateTime> getThreadsDatesForYear(Integer year) {
                return p_repo.getDatesFromPostCreation(year);
        }

        public List<LocalDateTime> getCommentsDatesForYear(Integer year) {
                return c_repo.getDatesFromCommentCreation(year);
        }
}
