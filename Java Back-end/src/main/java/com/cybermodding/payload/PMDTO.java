package com.cybermodding.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class PMDTO {
    private Long sender_id;
    private Long recipient_id;
    private String title;
    private String content;
}
