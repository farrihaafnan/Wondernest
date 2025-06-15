package com.wondernest.userlearning.repository;

import com.wondernest.userlearning.model.Parent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.Optional;

public interface ParentRepository extends JpaRepository<Parent, UUID> {
    Optional<Parent> findByEmail(String email);
    boolean existsByEmail(String email);
} 