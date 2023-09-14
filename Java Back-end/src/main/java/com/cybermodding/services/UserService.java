package com.cybermodding.services;

import java.util.Date;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.cybermodding.entities.User;
import com.cybermodding.enumerators.ERole;
import com.cybermodding.enumerators.EUserLevel;
import com.cybermodding.exception.CustomException;
import com.cybermodding.payload.CustomResponse;
import com.cybermodding.repositories.RoleRepo;
import com.cybermodding.repositories.UserPageRepo;
import com.cybermodding.repositories.UserRepo;

@Service
public class UserService {

    @Autowired
    UserRepo u_repo;
    @Autowired
    UserPageRepo u_page_repo;
    @Autowired
    RoleRepo roleRepository;

    public User getById(Long id) {
        if (u_repo.existsById(id))
            return u_repo.findById(id).get();
        else
            throw new CustomException(HttpStatus.BAD_REQUEST, "** User not found **");
    }

    public Page<User> getUsersPagination(Pageable pageable) {
        return u_page_repo.findAll(pageable);
    }

    public ResponseEntity<CustomResponse> deleteById(Long id) {
        if (u_repo.existsById(id)) {
            u_repo.deleteById(id);
            CustomResponse cr = new CustomResponse(new Date(), "** User deleted succesfully **",
                    HttpStatus.OK);
            return new ResponseEntity<CustomResponse>(cr, HttpStatus.OK);
        } else {
            CustomResponse cr = new CustomResponse(new Date(), "** User not found **",
                    HttpStatus.NOT_FOUND);
            return new ResponseEntity<CustomResponse>(cr, HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<?> updateUser(Long id, User u) {
        boolean hasPriviliges = u_repo.findById(id).get().getRoles().stream()
                .anyMatch(
                        r -> r.getRoleName().equals(ERole.ROLE_ADMIN) || r.getRoleName().equals(ERole.ROLE_MODERATOR));

        if (u_repo.existsById(id)) {
            if (hasPriviliges || id.equals(u.getId())) {
                // u.setPassword(u_repo.findById(id).get().getPassword());
                User updatedUser = u_repo.save(u);
                return new ResponseEntity<User>(updatedUser, HttpStatus.OK);
            } else {
                CustomResponse cr = new CustomResponse(new Date(), "** Input ID and User ID do not match **",
                        HttpStatus.BAD_REQUEST);
                return new ResponseEntity<CustomResponse>(cr, HttpStatus.BAD_REQUEST);
            }
        } else {
            CustomResponse cr = new CustomResponse(new Date(), "** User not found **",
                    HttpStatus.NOT_FOUND);
            return new ResponseEntity<CustomResponse>(cr, HttpStatus.NOT_FOUND);
        }
    }

    public CustomResponse banUser(Long id) {
        if (u_repo.existsById(id)) {
            User u = u_repo.findById(id).get();
            u.setRoles(Set.of(roleRepository.findById(4l).get()));
            u_repo.save(u);
            return new CustomResponse(new Date(), "** User Banned succesfully **",
                    HttpStatus.OK);
        } else {
            return new CustomResponse(new Date(), "** User not found **",
                    HttpStatus.BAD_REQUEST);
        }
    }

    public EUserLevel getRank(Long id) {
        User u = u_repo.findById(id).get();
        return u.getRoles().stream().anyMatch(r -> r.getRoleName().equals(ERole.ROLE_ADMIN)) ? EUserLevel.BOSS
                : u.getRoles().stream().anyMatch(r -> r.getRoleName().equals(ERole.ROLE_MODERATOR)) ? EUserLevel.MID
                        : u.getRoles().stream().anyMatch(r -> r.getRoleName().equals(ERole.ROLE_BANNED))
                                ? EUserLevel.BANNED
                                : EUserLevel.BASE;
    }
}
