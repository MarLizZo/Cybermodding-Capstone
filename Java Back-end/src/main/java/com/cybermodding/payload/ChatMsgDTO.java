package com.cybermodding.payload;

import java.time.LocalDate;

import com.cybermodding.enumerators.EUserLevel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMsgDTO {
    private String content;
    private String username;
    private Long user_id;
    private EUserLevel level;
    private LocalDate date;
}
