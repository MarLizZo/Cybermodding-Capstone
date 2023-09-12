package com.cybermodding.runners;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Random;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.cybermodding.entities.ChatMessage;
import com.cybermodding.entities.Comment;
import com.cybermodding.entities.Post;
import com.cybermodding.entities.Role;
import com.cybermodding.entities.SideBlock;
import com.cybermodding.entities.User;
import com.cybermodding.enumerators.EPostType;
import com.cybermodding.enumerators.EReaction;
import com.cybermodding.enumerators.ERole;
import com.cybermodding.enumerators.ESideBlock;
import com.cybermodding.enumerators.EUserLevel;
import com.cybermodding.payload.PostDTO;
import com.cybermodding.payload.ReactionDTO;
import com.cybermodding.payload.RegisterDto;
import com.cybermodding.payload.SectionDto;
import com.cybermodding.payload.SubSectionDto;
import com.cybermodding.repositories.RoleRepo;
import com.cybermodding.repositories.UserRepo;
import com.cybermodding.services.AuthService;
import com.cybermodding.services.ChatService;
import com.cybermodding.services.CommentService;
import com.cybermodding.services.PostService;
import com.cybermodding.services.SectionService;
import com.cybermodding.services.SideBlockService;
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
        @Autowired
        SideBlockService sb_repo;
        @Autowired
        CommentService comm_svc;

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
                // createPosts(100);

                // create Side blocks
                // createSideBlocks();

                // create Comments
                // createComments(250);

                // create Reactions
                // createReactions(400);
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
                                        .user(userRepository.getRandomUser()).date(LocalDate.now())
                                        .level(EUserLevel.BASE)
                                        .build());
                }
        }

        private void createSections() {
                s_svc.saveSection(new SectionDto("Presentazioni", "Qui puoi presentarti e farti conoscere", true, 1));
                s_svc.saveSection(new SectionDto("Intelligenza Artificiale",
                                "Qui trovate le ultime notizie sul mondo delle IA",
                                true, 2));
                s_svc.saveSection(new SectionDto("Computer", "Trattiamo qui tutto ciò che riguarda i PC", true, 3));
                s_svc.saveSection(new SectionDto("Console", "Tutto il mondo delle Console da gioco", true, 4));
        }

        private void createSubSections() {
                ss_svc.saveSubSection(
                                new SubSectionDto("Benvenuto", "Dacci la possibilità di darti il benvenuto", true, 1,
                                                1l));
                ss_svc.saveSubSection(
                                new SubSectionDto("Social", "Puoi condividere i tuoi canali Social", true, 2, 1l));

                ss_svc.saveSubSection(
                                new SubSectionDto("News generali", "Le notizie di ogni genere sulle IA", true, 1, 2l));
                ss_svc.saveSubSection(
                                new SubSectionDto("Smart Home", "Guide e notizie sulle innovazioni per la domotica",
                                                true, 2, 2l));
                ss_svc.saveSubSection(new SubSectionDto("Machine/Deep Learning",
                                "Qui possiamo discutere su come le IA apprendono", true, 3, 2l));
                ss_svc.saveSubSection(new SubSectionDto("Etica e riflessioni",
                                "Parliamo di etica, argomento centrale nel mondo delle IA", true, 4, 2l));
                ss_svc.saveSubSection(
                                new SubSectionDto("Guide e Risorse", "Qui trovate numerose guide e materiale didattico",
                                                true, 5, 2l));

                ss_svc.saveSubSection(new SubSectionDto("Hardware e Componenti",
                                "Notizie e recensioni sui componenti Hardware",
                                true, 1, 3l));
                ss_svc.saveSubSection(
                                new SubSectionDto("Software e OS", "Aggiornamenti su OS e recensioni su vari Software",
                                                true, 2, 3l));
                ss_svc.saveSubSection(new SubSectionDto("Modding e Personalizzazioni",
                                "Guide e Showcase per la customizzazione del PC", true, 3, 3l));
                ss_svc.saveSubSection(new SubSectionDto("PC Gaming", "Guide e notizie sul mondo del PC gaming ", true,
                                4, 3l));

                ss_svc.saveSubSection(new SubSectionDto("PS5 News", "Le notizie sulla Next-Gen di SONY", true, 1, 4l));
                ss_svc.saveSubSection(
                                new SubSectionDto("PS5 Jailbreak", "Guide e notizie sullo stato del jailbreak", true, 2,
                                                4l));
                ss_svc.saveSubSection(
                                new SubSectionDto("XBOX News", "Le notizie che riguardano la console di Microsoft",
                                                true, 3, 4l));
                ss_svc.saveSubSection(new SubSectionDto("Nintendo Switch News",
                                "Qui troviamo le notizie sulla console portatile Switch", true, 4, 4l));
        }

        private void createPosts(int amount) {
                Random rand = new Random();
                Faker fk = Faker.instance();

                for (int i = 0; i < amount; i++) {
                        p_svc.createNewPost(
                                        new PostDTO(fk.lorem().sentence(5),
                                                        fk.lorem().paragraph(rand.nextInt(2, 8)),
                                                        rand.nextInt(1, 10) > 5 ? EPostType.GENERAL : EPostType.NEWS,
                                                        userRepository.getRandomUser().getId(),
                                                        ss_svc.getRandom().getId()));
                }
        }

        private void createSideBlocks() {
                Faker fk = Faker.instance();
                sb_repo.saveBlock(SideBlock.builder().title("Block One").content(fk.lorem().paragraph()).active(true)
                                .e_block_type(ESideBlock.BLOCK_FORUM).order_number(1).build());

                sb_repo.saveBlock(SideBlock.builder().title("Block Two").content(fk.lorem().paragraph()).active(true)
                                .e_block_type(ESideBlock.BLOCK_FORUM).order_number(2).build());

                sb_repo.saveBlock(SideBlock.builder().title("Block Three").content(fk.lorem().paragraph()).active(true)
                                .e_block_type(ESideBlock.BLOCK_FORUM).order_number(3).build());
        }

        private void createComments(int amount) {
                Faker fk = Faker.instance();
                for (int i = 0; i < amount; i++) {
                        Post p = p_svc.getRandom();
                        comm_svc.saveComment(Comment.builder().content(fk.lorem().paragraph(6))
                                        .publishedDate(LocalDateTime.now())
                                        .post(p).user(userRepository.getRandomUser()).build());
                }
        }

        private void createReactions(int amount) {
                for (int i = 0; i < amount; i++) {
                        Random rand = new Random();
                        int res = rand.nextInt(1, 20);
                        EReaction type = res < 8 ? EReaction.LIKE
                                        : res >= 8 && res < 13 ? EReaction.DISLIKE : EReaction.THANKS;
                        ReactionDTO react = new ReactionDTO(userRepository.getRandomUser().getId(),
                                        p_svc.getRandom().getId(), type);
                        p_svc.addReaction(react);
                }
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
