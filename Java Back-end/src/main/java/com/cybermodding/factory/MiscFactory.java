package com.cybermodding.factory;

import java.time.LocalDateTime;

import com.cybermodding.entities.PrivateMessage;
import com.cybermodding.entities.Section;
import com.cybermodding.entities.SideBlock;
import com.cybermodding.entities.SubSection;
import com.cybermodding.responses.ResponseBase;
import com.cybermodding.responses.ResponsePM;
import com.cybermodding.responses.SectionResponse;
import com.cybermodding.responses.SideBlockResponse;
import com.cybermodding.responses.SubSectionResponse;

public class MiscFactory {
    public static SubSectionResponse getSubSectionResponse(String errorMessage, SubSection ss) {
        ResponseBase resBase = new ResponseBase(errorMessage.isEmpty() ? true : false, errorMessage,
                LocalDateTime.now());
        if (errorMessage.isEmpty()) {
            return new SubSectionResponse(resBase, ss.getId(), ss.getTitle(),
                    ss.getDescription(), ss.getActive(), ss.getOrder_number(), ss.getPosts());
        }
        return new SubSectionResponse(resBase, null, null, null, null, null, null);
    }

    public static SideBlockResponse getSideBlockResponse(String errorMessage, SideBlock sb) {
        ResponseBase resBase = new ResponseBase(errorMessage.isEmpty() ? true : false, errorMessage,
                LocalDateTime.now());
        if (errorMessage.isEmpty()) {
            return new SideBlockResponse(resBase, sb.getId(), sb.getTitle(),
                    sb.getContent(), sb.getActive(), sb.getE_block_type(), sb.getOrder_number());
        }
        return new SideBlockResponse(resBase, null, null, null, null, null, null);
    }

    public static SectionResponse getSectionResponse(String errorMessage, Section s) {
        ResponseBase resBase = new ResponseBase(errorMessage.isEmpty() ? true : false, errorMessage,
                LocalDateTime.now());
        if (errorMessage.isEmpty()) {
            return new SectionResponse(resBase, s.getId(), s.getTitle(),
                    s.getDescription(), s.getActive(), s.getOrder_number());
        }
        return new SectionResponse(resBase, null, null, null, null, null);
    }

    public static ResponsePM getResponsePM(String errorMessage, PrivateMessage pm) {
        ResponseBase resBase = new ResponseBase(errorMessage.isEmpty() ? true : false, errorMessage,
                LocalDateTime.now());
        if (errorMessage.isEmpty()) {
            return new ResponsePM(resBase, pm.getId(), pm.getTitle(), pm.getContent(), pm.getSender_user(),
                    pm.getRecipient_user(), pm.getDate(), pm.getViewed());
        }
        return new ResponsePM(resBase, null, null, null, null, null, null, null);
    }
}
