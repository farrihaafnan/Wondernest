package com.wondernest.userlearning.dto;

import com.wondernest.userlearning.model.Parent;
import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private String email;
    private String id;

    public LoginResponse(Parent parent, String token) {
        this.token = token;
        this.email = parent.getEmail();
        this.id = parent.getId().toString();
    }
} 