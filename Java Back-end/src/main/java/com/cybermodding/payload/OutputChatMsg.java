package com.cybermodding.payload;

import java.time.LocalDate;

import com.cybermodding.enumerators.EUserLevel;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OutputChatMsg {
    private String content;
    private String username;
    private EUserLevel level;
    private LocalDate date;
}
