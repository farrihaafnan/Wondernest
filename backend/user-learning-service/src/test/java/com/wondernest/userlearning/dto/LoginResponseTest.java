package com.wondernest.userlearning.dto;

import com.wondernest.userlearning.model.Child;
import com.wondernest.userlearning.model.Parent;
import org.junit.jupiter.api.Test;
import java.util.List;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

public class LoginResponseTest {
    @Test
    public void testConstructorAndFields() {
        Parent parent = new Parent();
        parent.setEmail("parent@example.com");
        parent.setId(UUID.randomUUID());
        Child child = new Child();
        parent.setChildren(List.of(child));
        LoginResponse resp = new LoginResponse(parent, "token123");
        assertEquals("token123", resp.getToken());
        assertEquals("parent@example.com", resp.getEmail());
        assertEquals(parent.getId().toString(), resp.getId());
        assertEquals(1, resp.getChildren().size());
    }
} 