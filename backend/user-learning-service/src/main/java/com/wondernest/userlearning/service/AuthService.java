package com.wondernest.userlearning.service;

import com.wondernest.userlearning.dto.LoginRequest;
import com.wondernest.userlearning.dto.RegisterRequest;
import com.wondernest.userlearning.dto.ChildDto;
import com.wondernest.userlearning.model.Parent;
import com.wondernest.userlearning.repository.ParentRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private ParentRepository parentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public Parent register(RegisterRequest request) {
        if (parentRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        Parent parent = new Parent();
        parent.setEmail(request.getEmail());
        parent.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        return parentRepository.save(parent);
    }

    @Transactional
    public Map<String, Object> login(LoginRequest request) {
        Parent parent = parentRepository.findByEmailWithChildren(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), parent.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        List<ChildDto> childrenDto = parent.getChildren().stream()
                .map(ChildDto::new)
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("id", parent.getId());
        response.put("email", parent.getEmail());
        response.put("children", childrenDto);
        response.put("token", "dummy-token-" + System.currentTimeMillis());
        
        return response;
    }
}
