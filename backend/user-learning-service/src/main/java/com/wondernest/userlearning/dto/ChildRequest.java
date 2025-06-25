package com.wondernest.userlearning.dto;

import lombok.Data;

@Data
public class ChildRequest {
    private String name;
    private int age;
    private String gender;
    private String avatarUrl;
    private String parentId;



    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    public String getGender() {
        return gender;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public String getParentId() {
        return parentId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

}