package com.wondernest.userlearning.dto;

import com.wondernest.userlearning.model.Child;
import lombok.Data;

import java.util.UUID;

@Data
public class ChildDto {
    private UUID id;
    private String name;
    private Integer age;
    private String gender;
    private String avatarUrl;

    public ChildDto(Child child) {
        this.id = child.getId();
        this.name = child.getName();
        this.age = child.getAge();
        this.gender = child.getGender();
        this.avatarUrl = child.getAvatarUrl();
    }
}

