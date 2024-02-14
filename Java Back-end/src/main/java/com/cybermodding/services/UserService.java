package com.cybermodding.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Set;
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
import com.cybermodding.entities.Role;
import com.cybermodding.entities.User;
import com.cybermodding.enumerators.ERole;
import com.cybermodding.enumerators.EUserLevel;
import com.cybermodding.factory.PostsFactory;
import com.cybermodding.factory.UserFactory;
import com.cybermodding.payload.UserModerationData;
import com.cybermodding.payload.PasswordUpdateDTO;
import com.cybermodding.payload.UpdateUser;
import com.cybermodding.repositories.CommentRepoPage;
import com.cybermodding.repositories.PostPageableRepo;
import com.cybermodding.repositories.RoleRepo;
import com.cybermodding.repositories.UserPageRepo;
import com.cybermodding.repositories.UserRepo;
import com.cybermodding.responses.AdminModsRes;
import com.cybermodding.responses.CommentCompleteOut;
import com.cybermodding.responses.CustomResponse;
import com.cybermodding.responses.PostWithID;
import com.cybermodding.responses.ProfileOut;
import com.cybermodding.responses.ResponseBase;
import com.cybermodding.responses.SearchRes;
import com.cybermodding.responses.UserResponse;

@Service
@SuppressWarnings("null")
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
        @Autowired
        PostPageableRepo post_repo;
        @Autowired
        CommentRepoPage comment_repo;

        public User getById(Long id) {
                return u_repo.existsById(id) ? u_repo.findById(id).get() : null;
        }

        public UserResponse getUserOut(Long id) {
                User u = getById(id);
                return UserFactory.getUserResponse(u == null ? "** User not found **" : "", u);
        }

        public Page<User> getUsersPagination(Pageable pageable) {
                return u_page_repo.findAll(pageable);
        }

        public List<User> getLimitSix(String uname) {
                return u_repo.getFromNameLimit(uname);
        }

        public AdminModsRes getAdminMods() {
                List<User> ls = u_repo.findAll();
                List<User> admins = ls.stream().filter(u -> UserFactory.getRank(u).equals(EUserLevel.BOSS))
                                .collect(Collectors.toList());
                List<User> mods = ls.stream()
                                .filter(u -> UserFactory.getRank(u).equals(EUserLevel.MID))
                                .collect(Collectors.toList());

                List<ProfileOut> outAdmins = new ArrayList<ProfileOut>();
                admins.forEach(ad -> {
                        ProfileOut pout = UserFactory.getProfileOut("", ad);
                        outAdmins.add(pout);
                });

                List<ProfileOut> outMods = new ArrayList<ProfileOut>();
                mods.forEach(mod -> {
                        ProfileOut pout = UserFactory.getProfileOut("", mod);
                        outMods.add(pout);
                });

                return AdminModsRes.builder().response(new ResponseBase(true, "", LocalDateTime.now()))
                                .admins(outAdmins)
                                .mods(outMods).build();
        }

        public Page<ProfileOut> getUsersPaginationProfile(Pageable page) {
                Page<User> users = u_page_repo.findAll(page);

                Page<ProfileOut> outPage = users.map(u -> {
                        return UserFactory.getProfileOut("", u);
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

        public UserResponse updateAvatar(Long id, MultipartFile file, String tmpAvatarString) {
                if (u_repo.existsById(id)) {
                        User fromDB = u_repo.findById(id).get();

                        // delete eventually the tmp avatars
                        if (!tmpAvatarString.isEmpty()) {
                                String[] arrLs = tmpAvatarString.split(",");
                                if (ftpSvc.deleteFile(Arrays.asList(arrLs))) {
                                        System.out.println("Temp folder cleanup ok");
                                }
                        }

                        if (!file.isEmpty()) {
                                String path = ftpSvc.uploadAvatar(file, fromDB.getUsername(), false);
                                if (path != null) {
                                        fromDB.setAvatar(path);
                                        u_repo.save(fromDB);
                                        return UserFactory.getUserResponse("", fromDB);
                                } else {
                                        return UserFactory.getUserResponse("** Upload error **", null);
                                }
                        } else {
                                return UserFactory.getUserResponse("** Invalid Avatar **", null);
                        }
                } else {
                        return UserFactory.getUserResponse("** User not found **", null);
                }
        }

        public UserResponse updateUser(Long id, UpdateUser u, Set<Role> roles) {
                boolean hasPriviliges = u_repo.findById(id).get().getRoles().stream()
                                .anyMatch(
                                                r -> r.getRoleName().equals(ERole.ROLE_ADMIN)
                                                                || r.getRoleName().equals(ERole.ROLE_MODERATOR));

                if (u_repo.existsById(id) && u_repo.existsById(u.getId())) {
                        if (hasPriviliges || id.equals(u.getId())) {
                                User fromDB = u_repo.findById(u.getId()).get();
                                fromDB.setUsername(u.getUsername());
                                fromDB.setEmail(u.getEmail());
                                fromDB.setDescription(u.getDescription());
                                // fromDB.setAvatar(avatarPath);
                                fromDB.setBirthdate(u.getBirthdate());

                                if (hasPriviliges) {
                                        if (roles != null) {
                                                fromDB.setRoles(roles);
                                        }
                                }

                                u_repo.save(fromDB);
                                return UserFactory.getUserResponse("", fromDB);
                        } else {
                                return UserFactory.getUserResponse("** Input ID and User ID do not match **", null);
                        }
                } else {
                        return UserFactory.getUserResponse("** User not found **", null);
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
                                                return UserFactory.getUserResponse("", u);
                                        } else {
                                                return UserFactory.getUserResponse("** Credentials not valid **", null);
                                        }
                                } else {
                                        return UserFactory.getUserResponse("** Passwords do not match **", null);
                                }
                        } else {
                                return UserFactory.getUserResponse("** Invalid Password **", null);
                        }
                } else {
                        return UserFactory.getUserResponse("** User IDs do not match **", null);
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

        public ProfileOut getProfile(Long id) {
                User u = getById(id);
                return u == null ? UserFactory.getProfileOut("** User not found **", u)
                                : UserFactory.getProfileOut("", u);
        }

        public User getRandom() {
                return u_repo.getRandomUser();
        }

        public Page<ProfileOut> searchUsersPageByUsernamePart(String usernamePart, Pageable pageable) {
                Page<User> page = u_page_repo.findAllByUsername(usernamePart, pageable);
                Page<ProfileOut> profOut = page.map(pr -> {
                        return UserFactory.getProfileOut("", pr);
                });
                return profOut;
        }

        public Page<CommentCompleteOut> searchCommentPageByBodyPart(String bodyPart, Pageable pageable) {
                Page<Comment> lsComment = comment_repo.findAllByBodyPart(bodyPart.toLowerCase(), pageable);
                Page<CommentCompleteOut> com = lsComment.map(c -> {
                        return PostsFactory.getCommentCompleteOut(c);
                });
                return com;
        }

        public Page<PostWithID> searchPostPageByTitlePart(String bodyPart, Pageable pageable) {
                Page<Post> pid = post_repo.findAllByTitlePart(bodyPart.toLowerCase(), pageable);
                Page<PostWithID> pout = pid.map(p -> {
                        return PostsFactory.getPostWithID("", p);
                });
                return pout;
        }

        public SearchRes searchStr(String toSearch) {
                Page<ProfileOut> lsUsers = searchUsersPageByUsernamePart(toSearch, Pageable.ofSize(8));
                Page<PostWithID> lsPost = searchPostPageByTitlePart(toSearch, Pageable.ofSize(8));
                Page<CommentCompleteOut> lsComment = searchCommentPageByBodyPart(toSearch, Pageable.ofSize(8));

                return new SearchRes(lsUsers, lsPost, lsComment);
        }
}
