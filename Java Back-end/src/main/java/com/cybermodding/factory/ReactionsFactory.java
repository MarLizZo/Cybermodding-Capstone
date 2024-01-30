package com.cybermodding.factory;

import java.time.LocalDateTime;

import com.cybermodding.entities.Reaction;
import com.cybermodding.responses.ReactionResponse;
import com.cybermodding.responses.ResponseBase;

public class ReactionsFactory {
    public static ReactionResponse getReactionResponse(String errorMessage, Reaction r) {
        ResponseBase resBase = new ResponseBase(errorMessage.isEmpty() ? true : false, errorMessage,
                LocalDateTime.now());
        if (!errorMessage.isEmpty()) {
            return new ReactionResponse(resBase, r.getId(), r.getUser(), r.getType());
        }
        return new ReactionResponse(resBase, null, null, null);
    }
}
