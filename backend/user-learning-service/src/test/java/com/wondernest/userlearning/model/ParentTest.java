package com.wondernest.userlearning.model;

import org.junit.jupiter.api.Test;
import java.util.List;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

public class ParentTest {
    @Test
    public void testSettersAndGetters() {
        Parent parent = new Parent();
        UUID id = UUID.randomUUID();
        parent.setId(id);
        parent.setEmail("parent@example.com");
        parent.setChildren(List.of(new Child()));
        assertEquals(id, parent.getId());
        assertEquals("parent@example.com", parent.getEmail());
        assertEquals(1, parent.getChildren().size());
    }

    @Test
    public void testEqualsAndHashCode() {
        Parent p1 = new Parent();
        Parent p2 = new Parent();
        UUID id = UUID.randomUUID();
        p1.setId(id);
        p2.setId(id);
        assertEquals(p1, p2);
        assertEquals(p1.hashCode(), p2.hashCode());
    }

    @Test
    public void testToString() {
        Parent parent = new Parent();
        parent.setEmail("test");
        assertTrue(parent.toString().contains("test"));
    }
} 