package com.cybermodding.responses;

import com.cybermodding.enumerators.ESideBlock;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Builder
@Getter
@Setter
public class SideBlockResponse {
    private ResponseBase response;
    private Long id;
    private String title;
    private String content;
    private Boolean active;
    private ESideBlock e_block_type;
    private Integer order_number;
}
