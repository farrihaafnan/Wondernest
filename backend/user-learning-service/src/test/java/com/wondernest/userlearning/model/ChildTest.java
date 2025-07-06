package com.wondernest.userlearning.model;

import org.junit.jupiter.api.Test;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

public class ChildTest {
    @Test
    public void testSettersAndGetters() {
        Child child = new Child();
        UUID id = UUID.randomUUID();
        child.setId(id);
        child.setName("name");
        child.setAge(7);
        child.setGender("boy");
        child.setAvatarUrl("url");
        assertEquals(id, child.getId());
        assertEquals("name", child.getName());
        assertEquals(7, child.getAge());
        assertEquals("boy", child.getGender());
        assertEquals("url", child.getAvatarUrl());
    }

    @Test
    public void testEqualsAndHashCode() {
        Child c1 = new Child();
        Child c2 = new Child();
        UUID id = UUID.randomUUID();
        c1.setId(id);
        c2.setId(id);
        assertEquals(c1, c2);
        assertEquals(c1.hashCode(), c2.hashCode());
    }

    @Test
    public void testToString() {
        Child child = new Child();
        child.setName("test");
        assertTrue(child.toString().contains("test"));
    }
} 