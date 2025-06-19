package com.wondernest.userlearning.repository;

import com.wondernest.userlearning.model.Story;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface StoryRepository extends JpaRepository<Story, UUID> {
    List<Story> findByChildId(UUID childId);
}

