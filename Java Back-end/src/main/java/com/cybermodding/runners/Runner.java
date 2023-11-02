package com.cybermodding.runners;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.cybermodding.entities.ChatMessage;
import com.cybermodding.entities.Comment;
import com.cybermodding.entities.Post;
import com.cybermodding.entities.PrivateMessage;
import com.cybermodding.entities.Reaction;
import com.cybermodding.entities.Role;
import com.cybermodding.entities.SideBlock;
import com.cybermodding.entities.User;
import com.cybermodding.enumerators.EPostType;
import com.cybermodding.enumerators.EReaction;
import com.cybermodding.enumerators.ERole;
import com.cybermodding.enumerators.ESideBlock;
import com.cybermodding.enumerators.EUserLevel;
import com.cybermodding.payload.BlockDTO;
import com.cybermodding.payload.PostDTO;
import com.cybermodding.payload.ReactionDTO;
import com.cybermodding.payload.RegisterDto;
import com.cybermodding.payload.SectionDto;
import com.cybermodding.payload.SubSectionDto;
import com.cybermodding.repositories.CommentRepo;
import com.cybermodding.repositories.PMRepo;
import com.cybermodding.repositories.PostRepo;
import com.cybermodding.repositories.ReactionRepo;
import com.cybermodding.repositories.RoleRepo;
import com.cybermodding.repositories.UserRepo;
import com.cybermodding.services.AuthService;
import com.cybermodding.services.ChatService;
import com.cybermodding.services.CommentService;
import com.cybermodding.services.PMService;
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
        @Autowired
        PostRepo p_repo;
        @Autowired
        ReactionRepo react_repo;
        @Autowired
        CommentRepo comm_repo;
        @Autowired
        PMService pm_svc;
        @Autowired
        PMRepo pm_repo;

        @Override
        public void run(String... args) throws Exception {
                System.out.println("** ..Running.. **");

                // create roles columns
                // setRoleDefault();

                // create my user and give admin privileges
                // createAndSetAdmin();

                // faker users
                // createFakeUsers(80);

                // set random Moderators and Admin
                // setPrivileges();

                // faker chat test
                // createFakeChatMsg(50);

                // clear older chat messages
                // chatSvc.cleanDB();

                // create sections
                // createSections();

                // create SubSections
                // createSubSections();

                // create Posts
                // createPosts(150);

                // create Side blocks
                // createSideBlocks();

                // create Comments
                // createComments(350);

                // create Reactions
                // createReactions(400);

                System.out.println("** ..Ops done.. **");
        }

        private void testDeletePost() {
                Post p = p_repo.findById(151l).get();
                System.out.println(p.getComments().size() + " " + p.getReactions().size());

                if (p.getReactions().size() != 0) {
                        p.getReactions().forEach(r -> {
                                Optional<Reaction> re = react_repo.findById(r.getId());
                                if (re.isPresent()) {
                                        Reaction react = react_repo.findById(r.getId()).get();
                                        System.out.println("PRESENT Reaction ID: " + react.getId());
                                        react.setPost(null);
                                        react.setUser(null);
                                        react_repo.save(react);
                                        System.out.println("Saved Reaction ID: " + react.getId());
                                        react_repo.delete(react);
                                } else {
                                        System.out.println("DIOP NOT PRESENT");
                                }
                        });
                        System.out.println("Surpassed Reaction cycle..");
                        p.setReactions(List.of());
                        try {
                                p_repo.save(p);
                        } catch (Exception ex) {
                                System.out.println("DIOP " + ex.getMessage());
                        }

                        System.out.println("Post saved from Reactions");
                }

                if (p.getComments().size() != 0) {
                        p.getComments().forEach(c -> {
                                Optional<Comment> co = comm_repo.findById(c.getId());
                                if (co.isPresent()) {
                                        System.out.println("PRESENT Comment ID: " + co.get().getId());
                                        co.get().setPost(null);
                                        co.get().setUser(null);
                                        comm_repo.save(co.get());
                                        System.out.println("Saved Comment ID: " + co.get().getId());
                                        comm_repo.delete(co.get());
                                } else {
                                        System.out.println("NOT PRESENT");
                                }
                                System.out.println("Post saved from Comments");
                        });
                        System.out.println("Surpassed Comments cycle..");
                        p.setComments(List.of());
                        try {
                                p_repo.save(p);
                        } catch (Exception ex) {
                                System.out.println(ex.getMessage());
                        }
                }
                System.out.println(p.getComments().size() + " " + p.getReactions().size());
                try {
                        p.setSub_section(null);
                        p.setAuthor(null);
                        p_repo.save(p);
                        p_repo.delete(p);
                        if (p_repo.existsById(p.getId())) {
                                p_repo.deleteById(p.getId());
                        }
                } catch (Exception ex) {
                        System.out.println(ex.getMessage());
                }

        }

        private void setPrivileges() {
                for (int i = 0; i < 3; i++) {
                        User u = svc.getRandom();
                        if (u.getId().equals(1l)) {
                                continue;
                        }
                        u.setRoles(Set.of(roleRepository.findById(2l).get()));
                        userRepository.save(u);
                }
                for (int i = 0; i < 2; i++) {
                        User u = svc.getRandom();
                        if (u.getId().equals(1l)) {
                                continue;
                        }
                        u.setRoles(Set.of(roleRepository.findById(3l).get()));
                        userRepository.save(u);
                }
        }

        private void createAndSetAdmin() {
                User u = authService.register(new RegisterDto("Mar.LizZo",
                                "liz@liz.com", "qwertyqwerty",
                                "Ekse..Calibaaaaa", null,
                                LocalDate.of(1990, 1, 1)));
                u.setRoles(Set.of(roleRepository.findById(3l).get()));
                userRepository.save(u);
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
                s_svc.saveSection(new SectionDto("Off Topic", "Qui si può parlare liberamente di ogni cosa", true, 5));
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
                ss_svc.saveSubSection(new SubSectionDto("Generale",
                                "Possiamo discutere di qualunque cosa", true, 1, 5l));
                ss_svc.saveSubSection(new SubSectionDto("Consigli e richieste",
                                "Avete consigli o richieste per il forum? Scrivetelo qui", true, 2, 5l));
                ss_svc.saveSubSection(new SubSectionDto("Mercatino",
                                "Il mercatino dell'usato. Non ci prendiamo responsabilità", true, 3, 5l));
        }

        private void createPosts(int amount) {
                Random rand = new Random();
                Faker fk = Faker.instance();

                for (int i = 0; i < amount; i++) {
                        String img = "<center><img src='https://picsum.photos/500/250?random=" + String.valueOf(i + 1)
                                        + "'"
                                        + "></center><p></p>";
                        p_svc.createNewPost(
                                        new PostDTO(fk.lorem().sentence(5),
                                                        img + fk.lorem().paragraph(rand.nextInt(10, 35)),
                                                        rand.nextInt(1, 10) > 5 ? EPostType.GENERAL : EPostType.NEWS,
                                                        userRepository.getRandomUser().getId(),
                                                        ss_svc.getRandom().getId()));
                }
        }

        private void createMyPost() {
                String img = "<center><img src='https://www.lizsrv.altervista.org/image.php?di=XMUZ'></center><p></p>";
                p_svc.createNewPost(new PostDTO("Windows 12 in arrivo",
                                img + "L'evoluzione dei sistemi operativi è un momento atteso da milioni di utenti in tutto il mondo. Quando si tratta di Windows, il gigante del software Microsoft ha costantemente cercato di innovare e migliorare l'esperienza degli utenti. Con l'annuncio di Windows 12, gli appassionati di tecnologia e gli utenti di PC stanno anticipando con entusiasmo quali nuove funzionalità e miglioramenti potrebbero essere in arrivo.<p></p>"
                                                +
                                                "<h3>Nuove funzionalità</h3>" +
                                                "Interfaccia Utente Modernizzata: Microsoft potrebbe continuare a lavorare su un'interfaccia utente pulita e moderna, con maggiore flessibilità e personalizzazione per gli utenti.\r\n"
                                                + //
                                                "\r\n" + //
                                                "Miglioramenti alla sicurezza: Con la crescente minaccia delle attività cybercriminali, ci si può aspettare che Windows 12 includa nuove funzionalità di sicurezza avanzate per proteggere gli utenti.\r\n"
                                                + //
                                                "\r\n" + //
                                                "Integrazione Cloud: La sincronizzazione e l'accesso ai dati su diversi dispositivi potrebbero essere ulteriormente semplificati attraverso un'ampia integrazione con servizi cloud.\r\n"
                                                + //
                                                "\r\n" + //
                                                "Miglioramento delle prestazioni: Microsoft è sempre alla ricerca di modi per ottimizzare le prestazioni del sistema operativo, rendendo il sistema più reattivo e veloce.\r\n"
                                                + //
                                                "\r\n" + //
                                                "Applicazioni Universal Windows Platform (UWP): Con un maggiore focus sullo sviluppo di applicazioni UWP, gli utenti potrebbero beneficiare di una maggiore coerenza tra le applicazioni su diverse piattaforme.\r\n"
                                                + //
                                                "\r\n" + //
                                                "Assistente Virtuale Avanzato: Una versione migliorata di Cortana o un nuovo assistente virtuale potrebbero essere inclusi per semplificare le attività quotidiane.",
                                EPostType.NEWS, 1l, 9l));
        }

        private void createSideBlocks() {
                Faker fk = Faker.instance();
                sb_repo.saveBlock(BlockDTO.builder().title("Canale YouTube")
                                .content("<div class=\"d-flex flex-column align-items-center\">\r\n" + //
                                                "<img src=\"assets/block-yt.png\" class=\"mt-1 w-75\">\r\n" + //
                                                "<p class=\"mb-3 fs-5 fw-medium text-center\">Canale Youtube</p>\r\n" + //
                                                "<p class=\"text-center\">Vieni a trovarci sul nostro canale Youtube! Troverai molti podcast, news, recensioni, guide e altro ancora! E se ti piace quello che trovi, iscriviti ed attiva le notifiche, ci farebbe davvero molto piacere!</p>\r\n"
                                                + //
                                                "</div>")
                                .active(true)
                                .e_block_type(ESideBlock.BLOCK_ALL).order_number(1).build());

                sb_repo.saveBlock(BlockDTO.builder().title("Canale Telegram")
                                .content("<div class=\"d-flex flex-column align-items-center\">\r\n" + //
                                                "<img src=\"assets/block-tg.png\" class=\"mt-1 w-75\">\r\n" + //
                                                "<p class=\"mt-2 mb-3 fs-5 fw-medium text-center\">Canale Telegram</p>\r\n"
                                                + //
                                                "<p class=\"text-center\">Il nostro gruppo Telegram è sempre attivo e sul pezzo! Resta aggiornato con noi sulle ultime News, recensioni e guide che vengono pubblicate sul forum, e discutine con tutta la community.</p>\r\n"
                                                + //
                                                "</div>")
                                .active(true)
                                .e_block_type(ESideBlock.BLOCK_ALL).order_number(2).build());

                sb_repo.saveBlock(BlockDTO.builder().title("Pubblicità")
                                .content("<p class=\"fs-5 fw-medium text-center\">Pubblicità</p>\r\n" + //
                                                "<p class=\"text-center\">Questo è un blocco pubblicitario. Vi si può inserire una qualsiasi pubblicità per generare delle entrate atte a sostenere il costo del mantenimento del forum</p>")
                                .active(true)
                                .e_block_type(ESideBlock.BLOCK_ALL).order_number(3).build());

                sb_repo.saveBlock(BlockDTO.builder().title("Blocco Home")
                                .content("<p class=\"fs-5 fw-medium text-center\">Blocco Home</p>\r\n" + //
                                                "<p class=\"text-center\">Questo blocco appare solo nella Home. Può essere utile per banner pubblicitari che puntano ad un sito esterno, e non avere così lo stesso link ridondanti su più pagine. Dobbiamo essere SEO friendly!</p>")
                                .active(true)
                                .e_block_type(ESideBlock.BLOCK_HOME).order_number(4).build());
        }

        private void createComments(int amount) {
                Random rand = new Random();
                Faker fk = Faker.instance();
                for (int i = 0; i < amount; i++) {
                        Post p = p_svc.getRandom();
                        comm_svc.saveComment(Comment.builder().content(fk.lorem().paragraph(rand.nextInt(5, 15)))
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
