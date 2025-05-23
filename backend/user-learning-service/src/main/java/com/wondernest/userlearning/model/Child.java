package com.wondernest.userlearning.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "children")
public class Child {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer age;

    @ManyToOne
    @JoinColumn(name = "parent_id", nullable = false)
    private Parent parent;

    @Column(nullable = false)
    private String grade;

    @Column
    private String interests;
} 