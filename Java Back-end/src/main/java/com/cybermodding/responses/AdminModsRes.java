package com.cybermodding.responses;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminModsRes {
    private ResponseBase response;
    private List<ProfileOut> admins;
    private List<ProfileOut> mods;
}
