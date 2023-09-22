package com.cybermodding.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class UpdatePostDTO {
    private Long id;
    private String title;
    private String body;
    private Boolean active;
}
