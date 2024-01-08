package com.cybermodding.payload;

import lombok.Getter;

@Getter
public class ContactMessageDTO {
    private Long user_id;
    private String name;
    private String content;
    private String type;
}
