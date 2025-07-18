package com.wondernest.userlearning.repository;

import com.wondernest.userlearning.model.Parent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;
import java.util.Optional;

public interface ParentRepository extends JpaRepository<Parent, UUID> {
    Optional<Parent> findByEmail(String email);
    boolean existsByEmail(String email);
    
    @Query("SELECT p FROM Parent p LEFT JOIN FETCH p.children WHERE p.email = :email")
    Optional<Parent> findByEmailWithChildren(@Param("email") String email);

} 
