package com.wondernest.userlearning.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class LoginRequestTest {
    @Test
    public void testSettersAndGetters() {
        LoginRequest req = new LoginRequest();
        req.setEmail("test@example.com");
        req.setPassword("password123");
        assertEquals("test@example.com", req.getEmail());
        assertEquals("password123", req.getPassword());
    }
} 