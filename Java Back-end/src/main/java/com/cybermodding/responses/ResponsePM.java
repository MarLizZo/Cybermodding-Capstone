package com.cybermodding.responses;

import java.time.LocalDateTime;

import com.cybermodding.entities.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@Builder
public class ResponsePM {
    private ResponseBase response;
    private Long id;
    private String title;
    private String content;
    private User sender_user;
    private User recipient_user;
    private LocalDateTime date;
    private Boolean viewed;
}
