package com.wondernest.userlearning.repository;

import com.wondernest.userlearning.model.PicturePuzzle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface PicturePuzzleRepository extends JpaRepository<PicturePuzzle, UUID> {
    List<PicturePuzzle> findByLevel(Integer level);
} 