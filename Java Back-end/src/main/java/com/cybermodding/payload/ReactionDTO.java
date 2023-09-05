package com.cybermodding.payload;

import com.cybermodding.enumerators.EReaction;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class ReactionDTO {
    private Long user_id;
    private Long post_id;
    private EReaction type;
}
