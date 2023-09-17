package com.cybermodding.services;

import java.util.Comparator;
import java.util.Date;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.cybermodding.entities.Comment;
import com.cybermodding.entities.Post;
import com.cybermodding.entities.User;
import com.cybermodding.enumerators.ERole;
import com.cybermodding.enumerators.EUserLevel;
import com.cybermodding.exception.CustomException;
import com.cybermodding.payload.CommentCompleteDTO;
import com.cybermodding.payload.CustomResponse;
import com.cybermodding.payload.MyProfileDTO;
import com.cybermodding.payload.PasswordUpdateDTO;
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
    @Autowired
    AuthServiceImpl auth_svc;

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
                User fromDB = u_repo.findById(id).get();
                fromDB.setUsername(u.getUsername());
                fromDB.setEmail(u.getEmail());
                fromDB.setDescription(u.getDescription());
                fromDB.setAvatar(u.getAvatar());
                fromDB.setBirthdate(u.getBirthdate());

                User updatedUser = u_repo.save(fromDB);
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

    public User updatePassword(Long id, PasswordUpdateDTO passDto) {
        if (id.equals(passDto.getId())) {
            if (passDto.getActual().length() >= 8 && passDto.getRepeatActual().length() >= 8
                    && passDto.getNewPassword().length() >= 8 && passDto.getRepeatNewPassword().length() >= 8) {
                if (passDto.getActual().equals(passDto.getRepeatActual())
                        && passDto.getNewPassword().equals(passDto.getRepeatNewPassword())) {
                    Authentication authentication = auth_svc.authenticationManager
                            .authenticate(
                                    new UsernamePasswordAuthenticationToken(passDto.getUsername(),
                                            passDto.getActual()));
                    if (authentication.isAuthenticated()) {
                        User u = getById(id);
                        System.out.println("Autenticato");
                        u.setPassword(auth_svc.passwordEncoder.encode(passDto.getNewPassword()));
                        u_repo.save(u);
                        return u;
                    } else {
                        throw new CustomException(HttpStatus.BAD_REQUEST, "** Credentials not valid **");
                    }
                } else {
                    throw new CustomException(HttpStatus.BAD_REQUEST, "** Passwords do not match **");
                }
            } else {
                throw new CustomException(HttpStatus.BAD_REQUEST, "** Invalid Passwords **");
            }
        } else {
            throw new CustomException(HttpStatus.BAD_REQUEST, "** User ID do not match **");
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

    public MyProfileDTO getProfile(Long id) {
        User u = getById(id);

        if (u.getPosts().size() != 0) {
            u.getPosts().sort(new Comparator<Post>() {
                @Override
                public int compare(Post p1, Post p2) {
                    return p2.getPublishedDate().compareTo(p1.getPublishedDate());
                }
            });
        }

        Post p = u.getPosts().size() != 0 ? u.getPosts().get(0) : null;

        if (u.getComments().size() != 0) {
            u.getComments().sort(new Comparator<Comment>() {
                @Override
                public int compare(Comment p1, Comment p2) {
                    return p2.getPublishedDate().compareTo(p1.getPublishedDate());
                }
            });
        }

        Comment c = u.getComments().size() != 0 ? u.getComments().get(0) : null;

        CommentCompleteDTO cc = c != null ? new CommentCompleteDTO(c.getId(), c.getContent(), c.getPost()) : null;

        return new MyProfileDTO(u.getId(), u.getUsername(), u.getEmail(), u.getRegistrationDate(), u.getDescription(),
                u.getAvatar(), u.getBirthdate(), u.getPosts().size(), u.getComments().size(), p, cc, getRank(id));
    }
}
