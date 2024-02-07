package com.cybermodding.responses;

import com.cybermodding.enumerators.EUserLevel;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class OnlineSpyUserModel {
    private Long id;
    private String username;
    private EUserLevel level;
    private String session_id;
}
