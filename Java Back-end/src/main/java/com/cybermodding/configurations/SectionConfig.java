package com.cybermodding.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

import com.cybermodding.entities.Section;
import com.cybermodding.enumerators.ESectionCategory;

@Configuration
public class SectionConfig {

    @Bean
    @Scope("prototype")
    Section sectionCreator(String _title, String _content, Boolean _active, Integer _order_number,
            ESectionCategory _category) {
        return new Section(_title, _content, _active, _category, _order_number);
    }
}
