package com.cybermodding.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

import com.cybermodding.entities.Section;
import com.cybermodding.entities.SubSection;

@Configuration
public class SubSectionConfig {

    @Bean
    @Scope("prototype")
    SubSection subSectionCreator(String title, String description, Boolean active, Integer order_number,
            Section parent_section) {
        return SubSection.builder().title(title).description(description).active(active)
                .order_number(order_number).parent_section(parent_section).build();
    }
}
