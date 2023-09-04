package com.cybermodding.configurations;

import java.time.LocalDate;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

import com.cybermodding.entities.User;

@Configuration
public class UserConfig {

    @Bean("empty_user")
    @Scope("prototype")
    User emptyUserCreator() {
        return new User();
    }

    @Bean
    @Scope("prototype")
    User userCreator(String _username, String _email, String _password, LocalDate _registrationDate,
            String _description, String _avatar, LocalDate _birthdate) {
        return User.builder().username(_username).email(_email).password(_password).registrationDate(_registrationDate)
                .description(_description).avatar(_avatar).birthdate(_birthdate).build();
    }
}
