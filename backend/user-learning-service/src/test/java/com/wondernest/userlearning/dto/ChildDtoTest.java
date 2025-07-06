package com.wondernest.userlearning.dto;

import com.wondernest.userlearning.model.Child;
import org.junit.jupiter.api.Test;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

public class ChildDtoTest {
    @Test
    public void testConstructorAndFields() {
        Child child = new Child();
        UUID id = UUID.randomUUID();
        child.setId(id);
        child.setName("name");
        child.setAge(6);
        child.setGender("girl");
        child.setAvatarUrl("url");
        ChildDto dto = new ChildDto(child);
        assertEquals(id, dto.getId());
        assertEquals("name", dto.getName());
        assertEquals(6, dto.getAge());
        assertEquals("girl", dto.getGender());
        assertEquals("url", dto.getAvatarUrl());
    }
} 