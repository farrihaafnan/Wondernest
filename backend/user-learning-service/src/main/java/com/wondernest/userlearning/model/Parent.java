package com.wondernest.userlearning.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "parents")
public class Parent {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private List<Child> children;



    public UUID getId() {
        return id;
    }
    public String getEmail() {
        return email;
    }
    public String getPasswordHash() {
        return passwordHash;
    }
    public List<Child> getChildren() {
        return children;
    }

    public void setId(UUID id) {
        this.id = id;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public void setPasswordHash(String passwordHash) {  
        this.passwordHash = passwordHash;
    }
    public void setChildren(List<Child> children) {
        this.children = children;
    }


    
}
