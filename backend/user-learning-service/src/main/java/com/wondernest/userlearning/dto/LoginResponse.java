package com.wondernest.userlearning.dto;

import com.wondernest.userlearning.model.Child;
import com.wondernest.userlearning.model.Parent;
import lombok.Data;

import java.util.List;

@Data
public class LoginResponse {
    private String token;
    private String email;
    private String id;
    private List<Child> children;

    public LoginResponse(Parent parent, String token) {
        this.token = token;
        this.email = parent.getEmail();
        this.id = parent.getId().toString();
        this.children = parent.getChildren(); 
    }
}