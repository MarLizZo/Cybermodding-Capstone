package com.cybermodding.runners;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.cybermodding.entities.ChatMessage;
import com.cybermodding.entities.Role;
import com.cybermodding.entities.User;
import com.cybermodding.enumerators.EPostType;
import com.cybermodding.enumerators.ERole;
import com.cybermodding.enumerators.EUserLevel;
import com.cybermodding.payload.PostDTO;
import com.cybermodding.payload.RegisterDto;
import com.cybermodding.payload.SectionDto;
import com.cybermodding.payload.SubSectionDto;
import com.cybermodding.repositories.RoleRepo;
import com.cybermodding.repositories.UserRepo;
import com.cybermodding.services.AuthService;
import com.cybermodding.services.ChatService;
import com.cybermodding.services.PostService;
import com.cybermodding.services.SectionService;
import com.cybermodding.services.SubSectionService;
import com.cybermodding.services.UserService;
import com.github.javafaker.Faker;

@Component
public class Runner implements CommandLineRunner {

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
    @Autowired
    SectionService s_svc;
    @Autowired
    SubSectionService ss_svc;
    @Autowired
    PostService p_svc;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("** ..Runner.. **");

        // create roles columns
        setRoleDefault();

        // create my user and give admin privileges
        // createAndSetAdmin();

        // faker users
        // createFakeUsers(80);

        // faker chat test
        // createFakeChatMsg(50);

        // clear older chat messages
        // chatSvc.cleanDB();

        // create sections
        // createSections();

        // create SubSections
        // createSubSections();

        // create Posts
        // createPosts();
    }

    private void createAndSetAdmin() {
        User u = authService.register(new RegisterDto("Mar.LizZo",
                "liz@liz.com", "qwertyqwerty",
                "Ekse..Calibaaaaa", null,
                LocalDate.of(1990, 1, 1)));
        u.setRoles(Set.of(roleRepository.findById(3l).get()));
        svc.updateUser(u.getId(), u);
    }

    private void createFakeUsers(int amount) {
        for (int i = 0; i < amount; i++) {
            Faker fk = Faker.instance();
            authService.register(new RegisterDto(fk.name().username(),
                    fk.internet().emailAddress(), "qwertyqwerty",
                    "No descr please", null,
                    fk.date().birthday().toInstant().atZone(ZoneId.systemDefault()).toLocalDate()));
        }
    }

    private void createFakeChatMsg(int amount) {
        for (int i = 0; i < amount; i++) {
            chatSvc.saveMessage(ChatMessage.builder().content(Faker.instance().lorem().paragraph())
                    .user(userRepository.getRandomUser()).date(LocalDate.now()).level(EUserLevel.BASE)
                    .build());
        }
    }

    private void createSections() {
        s_svc.saveSection(new SectionDto("Presentazioni", "Qui puoi presentarti e farti conoscere", true, 1));
        s_svc.saveSection(new SectionDto("Intelligenza Artificiale", "Qui trovate le ultime notizie sul mondo delle IA",
                true, 2));
        s_svc.saveSection(new SectionDto("Computer", "Trattiamo qui tutto ciò che riguarda i PC", true, 3));
        s_svc.saveSection(new SectionDto("Console", "Tutto il mondo delle Console da gioco", true, 4));
    }

    private void createSubSections() {
        ss_svc.saveSubSection(
                new SubSectionDto("Benvenuto", "Dacci la possibilità di darti il benvenuto", true, 1, 1l));
        ss_svc.saveSubSection(new SubSectionDto("Social", "Puoi condividere i tuoi canali Social", true, 2, 1l));

        ss_svc.saveSubSection(new SubSectionDto("News generali", "Le notizie di ogni genere sulle IA", true, 1, 2l));
        ss_svc.saveSubSection(
                new SubSectionDto("Smart Home", "Guide e notizie sulle innovazioni per la domotica", true, 2, 2l));
        ss_svc.saveSubSection(new SubSectionDto("Machine/Deep Learning",
                "Qui possiamo discutere su come le IA apprendono", true, 3, 2l));
        ss_svc.saveSubSection(new SubSectionDto("Etica e riflessioni",
                "Parliamo di etica, argomento centrale nel mondo delle IA", true, 4, 2l));
        ss_svc.saveSubSection(
                new SubSectionDto("Guide e Risorse", "Qui trovate numerose guide e materiale didattico", true, 5, 2l));

        ss_svc.saveSubSection(new SubSectionDto("Hardware e Componenti", "Notizie e recensioni sui componenti Hardware",
                true, 1, 3l));
        ss_svc.saveSubSection(
                new SubSectionDto("Software e OS", "Aggiornamenti su OS e recensioni su vari Software", true, 2, 3l));
        ss_svc.saveSubSection(new SubSectionDto("Modding e Personalizzazioni",
                "Guide e Showcase per la customizzazione del PC", true, 3, 3l));
        ss_svc.saveSubSection(new SubSectionDto("PC Gaming", "Guide e notizie sul mondo del PC gaming ", true, 4, 3l));

        ss_svc.saveSubSection(new SubSectionDto("PS5 News", "Le notizie sulla Next-Gen di SONY", true, 1, 4l));
        ss_svc.saveSubSection(
                new SubSectionDto("PS5 Jailbreak", "Guide e notizie sullo stato del jailbreak", true, 2, 4l));
        ss_svc.saveSubSection(
                new SubSectionDto("XBOX News", "Le notizie che riguardano la console di Microsoft", true, 3, 4l));
        ss_svc.saveSubSection(new SubSectionDto("Nintendo Switch News",
                "Qui troviamo le notizie sulla console portatile Switch", true, 4, 4l));
    }

    private void createPosts() {
        Faker fk = Faker.instance();
        // welcome
        p_svc.createNewPost(
                new PostDTO(fk.lordOfTheRings().character(), fk.lorem().paragraph(4), EPostType.GENERAL, 5l, 1l));
        p_svc.createNewPost(
                new PostDTO(fk.lordOfTheRings().character(), fk.lorem().paragraph(7), EPostType.GENERAL, 6l, 1l));
        p_svc.createNewPost(
                new PostDTO(fk.lordOfTheRings().character(), fk.lorem().paragraph(5), EPostType.GENERAL, 11l, 1l));

        // social
        p_svc.createNewPost(
                new PostDTO(fk.dragonBall().character(), fk.lorem().paragraph(2), EPostType.GENERAL, 2l, 2l));
        p_svc.createNewPost(
                new PostDTO(fk.dragonBall().character(), fk.lorem().paragraph(1), EPostType.GENERAL, 3l, 2l));

        // IA - News generali
        p_svc.createNewPost(new PostDTO(fk.hacker().adjective(), fk.lorem().paragraph(12), EPostType.NEWS, 10l, 3l));
        p_svc.createNewPost(new PostDTO(fk.hacker().abbreviation(), fk.lorem().paragraph(13), EPostType.NEWS, 1l, 3l));
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

        Role banned = new Role();
        banned.setRoleName(ERole.ROLE_BANNED);
        if (!roleRepository.existsById(4l))
            roleRepository.save(banned);
    }
}
