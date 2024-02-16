package com.cybermodding.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cybermodding.entities.User;
import com.cybermodding.payload.ModerateUserInDTO;
import com.cybermodding.payload.UserModerationData;
import com.cybermodding.responses.AdminModsRes;
import com.cybermodding.responses.CustomResponse;
import com.cybermodding.responses.ProfileOut;
import com.cybermodding.responses.SearchRes;
import com.cybermodding.responses.UserResponse;
import com.cybermodding.payload.PasswordUpdateDTO;
import com.cybermodding.payload.UpdateUser;
import com.cybermodding.services.ModerationService;
import com.cybermodding.services.UserService;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserService u_svc;
    @Autowired
    ModerationService m_svc;

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        return new ResponseEntity<UserResponse>(u_svc.getUserOut(id), HttpStatus.OK);
    }

    @GetMapping("/name")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<UserModerationData>> getFromUsername(@RequestParam String u, Pageable page) {
        return ResponseEntity.ok(u_svc.getFromUsername(u, page));
    }

    @GetMapping("/usersRegStats/{year}")
    public ResponseEntity<List<LocalDate>> getUsersRegStats(@PathVariable Integer year) {
        return ResponseEntity.ok(m_svc.getRegDatesForYear(year));
    }

    @GetMapping("/names")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<User>> getUserLimitSix(@RequestParam String u) {
        return ResponseEntity.ok(u_svc.getLimitSix(u));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody UpdateUser u) {
        return ResponseEntity.ok(u_svc.updateUser(id, u, null));
    }

    @PostMapping("/{id}/updateAvatar")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> updateAvatar(@PathVariable Long id, @RequestParam("file") MultipartFile file,
            @RequestParam("tmpPaths") String tmpAv) {
        return ResponseEntity.ok(u_svc.updateAvatar(id, file, tmpAv));
    }

    @PostMapping("/pass/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> updatePassword(@PathVariable Long id, @RequestBody PasswordUpdateDTO passDto) {
        return ResponseEntity.ok(u_svc.updatePassword(id, passDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CustomResponse> deleteUser(@PathVariable Long id) {
        return u_svc.deleteById(id);
    }

    @GetMapping("")
    public ResponseEntity<?> getUsersPageSorted(Pageable pageable) {
        return new ResponseEntity<Page<ProfileOut>>(u_svc.getUsersPaginationProfile(pageable),
                HttpStatus.OK);
    }

    @GetMapping("/bosses")
    public ResponseEntity<AdminModsRes> getBosses() {
        return ResponseEntity.ok(u_svc.getAdminMods());
    }

    @GetMapping("/ban/{id}")
    @PreAuthorize("hasRole('ADMIN') || hasRole('MODERATOR')")
    public ResponseEntity<CustomResponse> banUser(@PathVariable Long id) {
        return ResponseEntity.ok(m_svc.banUser(id));
    }

    @PostMapping("/moderate/{id}")
    @PreAuthorize("hasRole('ADMIN') || hasRole('MODERATOR')")
    public ResponseEntity<UserModerationData> moderateUser(@PathVariable Long id, @RequestBody ModerateUserInDTO data) {
        return ResponseEntity.ok(m_svc.moderateUser(id, data));
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<ProfileOut> getProfileInfo(@PathVariable Long id) {
        return ResponseEntity.ok(u_svc.getProfile(id));
    }

    @GetMapping("/search/{str}")
    public ResponseEntity<SearchRes> searchInit(@PathVariable String str) {
        return ResponseEntity.ok(u_svc.searchStr(str));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<?>> searchUsers(@RequestParam(defaultValue = "users") String by,
            @RequestParam(defaultValue = "cyber") String input, Pageable pageable) {
        Page<?> pageOut = Page.empty();
        if (by.equals("users")) {
            pageOut = u_svc.searchUsersPageByUsernamePart(input, pageable);
        } else if (by.equals("posts")) {
            pageOut = u_svc.searchPostPageByTitlePart(input, pageable);
        } else if (by.equals("comments")) {
            pageOut = u_svc.searchCommentPageByBodyPart(input, pageable);
        }
        return ResponseEntity.ok(pageOut);
    }
}
