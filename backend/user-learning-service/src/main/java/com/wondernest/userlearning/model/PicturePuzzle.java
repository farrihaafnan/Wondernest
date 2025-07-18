package com.wondernest.userlearning.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "picture_puzzles")
public class PicturePuzzle {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private Integer level;

    @Column(name = "image_url", nullable = false)
    private String[] imageUrl;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }

    public String[] getImageUrl() { return imageUrl; }
    public void setImageUrl(String[] imageUrl) { this.imageUrl = imageUrl; }
} 