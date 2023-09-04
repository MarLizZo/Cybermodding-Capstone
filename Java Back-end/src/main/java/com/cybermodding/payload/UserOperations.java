package com.cybermodding.payload;

import java.util.Date;

import com.cybermodding.entities.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class UserOperations {
    private User user;
    private Date timestamp;
    private String message;
}
