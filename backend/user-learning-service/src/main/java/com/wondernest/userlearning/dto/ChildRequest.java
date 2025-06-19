package com.wondernest.userlearning.dto;

import lombok.Data;

@Data
public class ChildRequest {
    private String name;
    private int age;
    private String gender;
    private String avatarUrl;
    private String parentId;
}