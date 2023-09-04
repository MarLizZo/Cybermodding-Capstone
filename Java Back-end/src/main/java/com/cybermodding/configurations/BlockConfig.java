package com.cybermodding.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

import com.cybermodding.entities.SideBlock;
import com.cybermodding.enumerators.ESideBlock;

@Configuration
public class BlockConfig {

    @Bean
    @Scope("prototype")
    SideBlock sideCreator(String _title, String _content, Boolean _active, ESideBlock _eSideBlock, Integer _order) {
        return SideBlock.builder().title(_title).content(_content).active(_active).e_block_type(_eSideBlock)
                .order_number(_order)
                .build();
    }
}
