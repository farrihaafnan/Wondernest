package com.wondernest.userlearning.service;

import com.wondernest.userlearning.dto.LoginRequest;
import com.wondernest.userlearning.dto.RegisterRequest;
import com.wondernest.userlearning.model.Child;
import com.wondernest.userlearning.model.Parent;
import com.wondernest.userlearning.repository.ParentRepository;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private ParentRepository parentRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_shouldReturnParent() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");

        Parent parent = new Parent();
        parent.setEmail(request.getEmail());
        parent.setPasswordHash("hashedPassword");

        when(parentRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("hashedPassword");
        when(parentRepository.save(any(Parent.class))).thenReturn(parent);

        Parent result = authService.register(request);

        assertNotNull(result);
        assertEquals(request.getEmail(), result.getEmail());
    }

    @Test
    void register_shouldThrowException_whenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@example.com");
        request.setPassword("password123");

        when(parentRepository.existsByEmail(request.getEmail())).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.register(request);
        });

        assertEquals("Email already registered", exception.getMessage());
    }

    @Test
    void login_shouldReturnValidResponse() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");

        Parent parent = new Parent();
        parent.setId(UUID.randomUUID());
        parent.setEmail(request.getEmail());
        parent.setPasswordHash("hashedPassword");
        parent.setChildren(new ArrayList<>());

        when(parentRepository.findByEmailWithChildren(request.getEmail())).thenReturn(Optional.of(parent));
        when(passwordEncoder.matches(request.getPassword(), parent.getPasswordHash())).thenReturn(true);

        Map<String, Object> result = authService.login(request);

        assertNotNull(result);
        assertEquals(parent.getId(), result.get("id"));
        assertEquals(parent.getEmail(), result.get("email"));
        assertNotNull(result.get("children"));
        assertNotNull(result.get("token"));
    }

    @Test
    void login_shouldThrowException_whenEmailNotFound() {
        LoginRequest request = new LoginRequest();
        request.setEmail("nonexistent@example.com");
        request.setPassword("password123");

        when(parentRepository.findByEmailWithChildren(request.getEmail())).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login(request);
        });

        assertEquals("Invalid email or password", exception.getMessage());
    }

    @Test
    void login_shouldThrowException_whenPasswordDoesNotMatch() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("wrongpassword");

        Parent parent = new Parent();
        parent.setEmail(request.getEmail());
        parent.setPasswordHash("hashedPassword");
        parent.setChildren(new ArrayList<>());

        when(parentRepository.findByEmailWithChildren(request.getEmail())).thenReturn(Optional.of(parent));
        when(passwordEncoder.matches(request.getPassword(), parent.getPasswordHash())).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login(request);
        });

        assertEquals("Invalid email or password", exception.getMessage());
    }

    @Test
    void login_shouldReturnChildrenInResponse() {
        LoginRequest request = new LoginRequest();
        request.setEmail("parent@example.com");
        request.setPassword("password123");

        Parent parent = new Parent();
        parent.setId(UUID.randomUUID());
        parent.setEmail(request.getEmail());
        parent.setPasswordHash("hashedPassword");

        Child child1 = new Child();
        child1.setId(UUID.randomUUID());
        child1.setName("Child 1");
        child1.setAge(8);

        Child child2 = new Child();
        child2.setId(UUID.randomUUID());
        child2.setName("Child 2");
        child2.setAge(10);

        List<Child> children = Arrays.asList(child1, child2);
        parent.setChildren(children);

        when(parentRepository.findByEmailWithChildren(request.getEmail())).thenReturn(Optional.of(parent));
        when(passwordEncoder.matches(request.getPassword(), parent.getPasswordHash())).thenReturn(true);

        Map<String, Object> result = authService.login(request);

        assertNotNull(result);
        assertEquals(2, ((List<?>) result.get("children")).size());
    }
} 