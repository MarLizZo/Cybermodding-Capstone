package com.cybermodding.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

import com.cybermodding.entities.Section;

@Configuration
public class SectionConfig {

    @Bean
    @Scope("prototype")
    Section sectionCreator(String _title, String _content, Boolean _active, Integer _order_number) {
        return new Section(_title, _content, _active, _order_number);
    }
}
