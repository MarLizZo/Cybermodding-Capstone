package com.cybermodding.responses;

import com.cybermodding.entities.User;
import com.cybermodding.enumerators.EReaction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Builder
@Getter
@Setter
public class ReactionResponse {
    private ResponseBase response;
    private Long id;
    private User user;
    private EReaction type;
}
