package com.cybermodding.payload;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminModsDTO {
    private List<ProfileOutDTO> admins;
    private List<ProfileOutDTO> mods;
}
