package com.cybermodding.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cybermodding.entities.Comment;
import com.cybermodding.entities.Post;
import com.cybermodding.entities.User;
import com.cybermodding.enumerators.ERole;
import com.cybermodding.enumerators.EUserLevel;
import com.cybermodding.payload.CommentCompleteDTO;
import com.cybermodding.payload.UserModerationData;
import com.cybermodding.payload.PasswordUpdateDTO;
import com.cybermodding.payload.UpdateUser;
import com.cybermodding.repositories.RoleRepo;
import com.cybermodding.repositories.UserPageRepo;
import com.cybermodding.repositories.UserRepo;
import com.cybermodding.responses.AdminModsRes;
import com.cybermodding.responses.CustomResponse;
import com.cybermodding.responses.PostWithID;
import com.cybermodding.responses.ProfileOut;
import com.cybermodding.responses.ResponseBase;
import com.cybermodding.responses.UserResponse;

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

        @Autowired
        FTPUploadService ftpSvc;

        public User getById(Long id) {
                if (u_repo.existsById(id))
                        return u_repo.findById(id).get();
                else
                        return null;
        }

        public UserResponse getUserOut(Long id) {
                User u = getById(id);
                if (u != null) {
                        return new UserResponse(new ResponseBase(true, "", LocalDateTime.now()), u.getId(),
                                        u.getUsername(),
                                        u.getEmail(), u.getRegistrationDate(), u.getDescription(), u.getAvatar(),
                                        u.getBirthdate());
                } else {
                        return new UserResponse(new ResponseBase(false, "", LocalDateTime.now()), null, null, null,
                                        null, null,
                                        null, null);
                }
        }

        public Page<User> getUsersPagination(Pageable pageable) {
                return u_page_repo.findAll(pageable);
        }

        public List<User> getLimitSix(String uname) {
                return u_repo.getFromNameLimit(uname);
        }

        public AdminModsRes getAdminMods() {
                List<User> ls = u_repo.findAll();
                List<User> admins = ls.stream().filter(u -> getRank(u.getId()).equals(EUserLevel.BOSS))
                                .collect(Collectors.toList());
                List<User> mods = ls.stream()
                                .filter(u -> getRank(u.getId()).equals(EUserLevel.MID)).collect(Collectors.toList());

                List<ProfileOut> outAdmins = new ArrayList<ProfileOut>();
                admins.forEach(ad -> {
                        Post p = ad.getPosts().size() != 0 ? getLastPost(ad.getPosts()) : null;
                        Comment c = ad.getComments().size() != 0 ? getLastComment(ad.getComments()) : null;
                        PostWithID pdto = p != null
                                        ? new PostWithID(null, p.getId(), p.getTitle(), p.getBody(), p.getType(),
                                                        p.getAuthor().getId(),
                                                        p.getSub_section().getId(), p.getComments().size())
                                        : null;
                        CommentCompleteDTO cc = c != null
                                        ? new CommentCompleteDTO(c.getId(), c.getContent(),
                                                        new PostWithID(null, c.getId(), c.getPost().getTitle(),
                                                                        c.getPost().getBody(),
                                                                        c.getPost().getType(),
                                                                        c.getPost().getAuthor().getId(),
                                                                        c.getPost().getSub_section().getId(),
                                                                        c.getPost().getComments().size()))
                                        : null;

                        outAdmins.add(new ProfileOut(null, ad.getId(), ad.getUsername(), ad.getEmail(),
                                        ad.getRegistrationDate(),
                                        ad.getDescription(), ad.getAvatar(), ad.getBirthdate(), ad.getPosts().size(),
                                        ad.getComments().size(), pdto, cc, getRank(ad.getId())));
                });

                List<ProfileOut> outMods = new ArrayList<ProfileOut>();
                mods.forEach(mod -> {
                        Post p = mod.getPosts().size() != 0 ? getLastPost(mod.getPosts()) : null;
                        PostWithID pdto = p != null
                                        ? new PostWithID(null, p.getId(), p.getTitle(), p.getBody(), p.getType(),
                                                        p.getAuthor().getId(),
                                                        p.getSub_section().getId(), p.getComments().size())
                                        : null;
                        Comment c = mod.getComments().size() != 0 ? getLastComment(mod.getComments()) : null;
                        CommentCompleteDTO cc = c != null
                                        ? new CommentCompleteDTO(c.getId(), c.getContent(),
                                                        new PostWithID(null, c.getId(), c.getPost().getTitle(),
                                                                        c.getPost().getBody(),
                                                                        c.getPost().getType(),
                                                                        c.getPost().getAuthor().getId(),
                                                                        c.getPost().getSub_section().getId(),
                                                                        c.getPost().getComments().size()))
                                        : null;

                        outMods.add(new ProfileOut(null, mod.getId(), mod.getUsername(), mod.getEmail(),
                                        mod.getRegistrationDate(),
                                        mod.getDescription(), mod.getAvatar(), mod.getBirthdate(),
                                        mod.getPosts().size(),
                                        mod.getComments().size(), pdto, cc, getRank(mod.getId())));
                });

                return AdminModsRes.builder().response(new ResponseBase(true, "", LocalDateTime.now()))
                                .admins(outAdmins)
                                .mods(outMods).build();
        }

        public Page<ProfileOut> getUsersPaginationProfile(Pageable page) {
                Page<User> users = u_page_repo.findAll(page);

                Page<ProfileOut> outPage = users.map(u -> {
                        Comment last = u.getComments().size() != 0 ? getLastComment(u.getComments()) : null;
                        Post last_p = u.getPosts().size() != 0 ? getLastPost(u.getPosts()) : null;
                        PostWithID pdto = last_p != null
                                        ? new PostWithID(null, last_p.getId(), last_p.getTitle(), last_p.getBody(),
                                                        last_p.getType(),
                                                        last_p.getAuthor().getId(), last_p.getSub_section().getId(),
                                                        last_p.getComments().size())
                                        : null;
                        CommentCompleteDTO cc = last != null
                                        ? new CommentCompleteDTO(last.getId(), last.getContent(),
                                                        last_p != null
                                                                        ? new PostWithID(null, last_p.getId(),
                                                                                        last.getPost().getTitle(),
                                                                                        last.getPost().getBody(),
                                                                                        last.getPost().getType(),
                                                                                        last.getPost().getAuthor()
                                                                                                        .getId(),
                                                                                        last.getPost().getSub_section()
                                                                                                        .getId(),
                                                                                        last.getPost().getComments()
                                                                                                        .size())
                                                                        : null)
                                        : null;

                        return new ProfileOut(new ResponseBase(true, "", LocalDateTime.now()), u.getId(),
                                        u.getUsername(),
                                        u.getEmail(), u.getRegistrationDate(),
                                        u.getDescription(), u.getAvatar(), u.getBirthdate(), u.getPosts().size(),
                                        u.getComments().size(), pdto, cc, getRank(u.getId()));
                });
                return outPage;
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

        public UserResponse updateAvatar(Long id, MultipartFile file) {
                if (u_repo.existsById(id)) {
                        User fromDB = u_repo.findById(id).get();
                        if (!file.isEmpty()) {
                                String path = ftpSvc.uploadAvatar(file, fromDB.getUsername(), false);
                                if (path != null) {
                                        fromDB.setAvatar(path);
                                        u_repo.save(fromDB);
                                        return new UserResponse(new ResponseBase(true, "", LocalDateTime.now()),
                                                        fromDB.getId(), fromDB.getUsername(), fromDB.getEmail(),
                                                        fromDB.getRegistrationDate(), fromDB.getDescription(),
                                                        fromDB.getAvatar(), fromDB.getBirthdate());
                                } else {
                                        return new UserResponse(
                                                        new ResponseBase(false, "** Upload error **",
                                                                        LocalDateTime.now()),
                                                        null, null, null, null, null, null, null);
                                }
                        } else {
                                return new UserResponse(
                                                new ResponseBase(false, "** Invalid avatar **", LocalDateTime.now()),
                                                null, null, null, null, null, null, null);
                        }
                } else {
                        return new UserResponse(new ResponseBase(false, "** User not found **", LocalDateTime.now()),
                                        null, null, null, null, null, null, null);
                }
        }

        public UserResponse updateUser(Long id, UpdateUser u) {
                boolean hasPriviliges = u_repo.findById(id).get().getRoles().stream()
                                .anyMatch(
                                                r -> r.getRoleName().equals(ERole.ROLE_ADMIN)
                                                                || r.getRoleName().equals(ERole.ROLE_MODERATOR));

                if (u_repo.existsById(id)) {
                        if (hasPriviliges || id.equals(u.getId())) {
                                User fromDB = u_repo.findById(u.getId()).get();
                                fromDB.setUsername(u.getUsername());
                                fromDB.setEmail(u.getEmail());
                                fromDB.setDescription(u.getDescription());
                                // fromDB.setAvatar(avatarPath);
                                fromDB.setBirthdate(u.getBirthdate());

                                u_repo.save(fromDB);
                                return new UserResponse(new ResponseBase(true, "", LocalDateTime.now()), fromDB.getId(),
                                                fromDB.getUsername(),
                                                fromDB.getEmail(), fromDB.getRegistrationDate(),
                                                fromDB.getDescription(), fromDB.getAvatar(),
                                                fromDB.getBirthdate());
                        } else {
                                return new UserResponse(
                                                new ResponseBase(false, "** Input ID and User ID do not match **",
                                                                LocalDateTime.now()),
                                                null,
                                                null, null, null, null,
                                                null, null);
                        }
                } else {
                        return new UserResponse(new ResponseBase(false, "** User not found **", LocalDateTime.now()),
                                        null, null,
                                        null, null, null,
                                        null, null);
                }
        }

        public UserResponse updatePassword(Long id, PasswordUpdateDTO passDto) {
                if (id.equals(passDto.getId())) {
                        if (passDto.getActual().length() >= 8 && passDto.getRepeatActual().length() >= 8
                                        && passDto.getNewPassword().length() >= 8
                                        && passDto.getRepeatNewPassword().length() >= 8) {
                                if (passDto.getActual().equals(passDto.getRepeatActual())
                                                && passDto.getNewPassword().equals(passDto.getRepeatNewPassword())) {
                                        Authentication authentication = auth_svc.authenticationManager
                                                        .authenticate(
                                                                        new UsernamePasswordAuthenticationToken(
                                                                                        passDto.getUsername(),
                                                                                        passDto.getActual()));
                                        if (authentication.isAuthenticated()) {
                                                User u = getById(id);
                                                System.out.println("Autenticato");
                                                u.setPassword(auth_svc.passwordEncoder
                                                                .encode(passDto.getNewPassword()));
                                                u_repo.save(u);
                                                return new UserResponse(new ResponseBase(true, "", LocalDateTime.now()),
                                                                u.getId(),
                                                                u.getUsername(),
                                                                u.getEmail(), u.getRegistrationDate(),
                                                                u.getDescription(), u.getAvatar(),
                                                                u.getBirthdate());
                                        } else {
                                                return new UserResponse(
                                                                new ResponseBase(false, "** Credentials not valid **",
                                                                                LocalDateTime.now()),
                                                                null, null,
                                                                null, null, null,
                                                                null, null);
                                        }
                                } else {
                                        return new UserResponse(
                                                        new ResponseBase(false, "** Passwords do not match **",
                                                                        LocalDateTime.now()),
                                                        null, null,
                                                        null, null, null,
                                                        null, null);
                                }
                        } else {
                                return new UserResponse(
                                                new ResponseBase(false, "** Invalid Passwords **", LocalDateTime.now()),
                                                null,
                                                null,
                                                null, null, null,
                                                null, null);
                        }
                } else {
                        return new UserResponse(
                                        new ResponseBase(false, "** User ID do not match **", LocalDateTime.now()),
                                        null,
                                        null,
                                        null, null, null,
                                        null, null);
                }
        }

        public Page<UserModerationData> getFromUsername(String username, Pageable page) {
                Page<User> ls = this.u_page_repo.findAllByUsername(username.toLowerCase(), page);
                Page<UserModerationData> ls_data = ls.map(u -> {
                        return new UserModerationData(u.getId(), u.getUsername(), u.getEmail(), u.getRegistrationDate(),
                                        u.getDescription(), u.getAvatar(), u.getBirthdate(), u.getRoles(),
                                        u.getPosts().size(),
                                        u.getComments().size());
                });
                return ls_data;
        }

        public EUserLevel getRank(Long id) {
                User u = u_repo.findById(id).get();
                return u.getRoles().stream().anyMatch(r -> r.getRoleName().equals(ERole.ROLE_ADMIN)) ? EUserLevel.BOSS
                                : u.getRoles().stream().anyMatch(r -> r.getRoleName().equals(ERole.ROLE_MODERATOR))
                                                ? EUserLevel.MID
                                                : u.getRoles().stream().anyMatch(
                                                                r -> r.getRoleName().equals(ERole.ROLE_BANNED))
                                                                                ? EUserLevel.BANNED
                                                                                : EUserLevel.BASE;
        }

        public ProfileOut getProfile(Long id) {
                User u = getById(id);
                if (u != null) {
                        Post p = u.getPosts().size() != 0 ? getLastPost(u.getPosts()) : null;
                        PostWithID pdto = p != null
                                        ? new PostWithID(null, p.getId(), p.getTitle(), p.getBody(), p.getType(),
                                                        p.getAuthor().getId(),
                                                        p.getSub_section().getId(), p.getComments().size())
                                        : null;
                        Comment c = u.getComments().size() != 0 ? getLastComment(u.getComments()) : null;
                        CommentCompleteDTO cc = c != null
                                        ? new CommentCompleteDTO(c.getId(), c.getContent(),
                                                        new PostWithID(null, c.getPost().getId(),
                                                                        c.getPost().getTitle(), c.getPost().getBody(),
                                                                        c.getPost().getType(),
                                                                        c.getPost().getAuthor().getId(),
                                                                        c.getPost().getSub_section().getId(),
                                                                        c.getPost().getComments().size()))
                                        : null;

                        return new ProfileOut(new ResponseBase(true, "", LocalDateTime.now()), u.getId(),
                                        u.getUsername(),
                                        u.getEmail(), u.getRegistrationDate(), u.getDescription(),
                                        u.getAvatar(), u.getBirthdate(), u.getPosts().size(), u.getComments().size(),
                                        pdto, cc,
                                        getRank(id));
                } else {
                        return new ProfileOut(new ResponseBase(false, "** User not found **", LocalDateTime.now()),
                                        null, null,
                                        null, null, null, null, null, null, null, null, null, null);
                }
        }

        public Post getLastPost(List<Post> ls) {
                ls.sort(new Comparator<Post>() {
                        @Override
                        public int compare(Post p1, Post p2) {
                                return p2.getPublishedDate().compareTo(p1.getPublishedDate());
                        }
                });
                return ls.get(0);
        }

        public Comment getLastComment(List<Comment> ls) {
                ls.sort(new Comparator<Comment>() {
                        @Override
                        public int compare(Comment p1, Comment p2) {
                                return p2.getPublishedDate().compareTo(p1.getPublishedDate());
                        }
                });
                return ls.get(0);
        }

        public User getRandom() {
                return u_repo.getRandomUser();
        }
}
