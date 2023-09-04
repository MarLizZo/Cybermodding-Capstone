package com.cybermodding.services;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.cybermodding.entities.User;
import com.cybermodding.exception.MyAPIException;
import com.cybermodding.payload.CustomResponse;
import com.cybermodding.payload.UserOperations;
import com.cybermodding.repositories.UserPageRepo;
import com.cybermodding.repositories.UserRepo;

@Service
public class UserService {

    @Autowired
    UserRepo u_repo;
    @Autowired
    UserPageRepo u_page_repo;

    public User getById(Long id) {
        if (u_repo.existsById(id))
            return u_repo.findById(id).get();
        else
            throw new MyAPIException(HttpStatus.BAD_REQUEST, "** User not found **");
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
            throw new MyAPIException(HttpStatus.BAD_REQUEST, "** User not found **");
        }
    }

    public ResponseEntity<?> updateUser(Long id, User u) {
        if (u_repo.existsById(id)) {
            if (id.equals(u.getId())) {
                u.setPassword(u_repo.findById(id).get().getPassword());
                User updatedUser = u_repo.save(u);
                UserOperations output = new UserOperations(updatedUser, new Date(), "** User updated succesfully **");
                return new ResponseEntity<UserOperations>(output, HttpStatus.OK);
            } else {
                CustomResponse cr = new CustomResponse(new Date(), "** Input ID and User ID do not match **",
                        HttpStatus.BAD_REQUEST);
                return new ResponseEntity<CustomResponse>(cr, HttpStatus.BAD_REQUEST);
            }
        } else {
            throw new MyAPIException(HttpStatus.BAD_REQUEST, "** User not found **");
        }
    }
}
