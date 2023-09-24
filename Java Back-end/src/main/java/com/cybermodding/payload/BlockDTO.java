package com.cybermodding.payload;

import com.cybermodding.enumerators.ESideBlock;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class BlockDTO {
    private String title;
    private String content;
    private Boolean active;
    private ESideBlock e_block_type;
    private Integer order_number;
}
