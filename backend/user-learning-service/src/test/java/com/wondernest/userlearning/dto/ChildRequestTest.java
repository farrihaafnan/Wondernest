package com.wondernest.userlearning.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class ChildRequestTest {
    @Test
    public void testSettersAndGetters() {
        ChildRequest req = new ChildRequest();
        req.setName("name");
        req.setAge(5);
        req.setGender("boy");
        req.setAvatarUrl("url");
        req.setParentId("pid");
        assertEquals("name", req.getName());
        assertEquals(5, req.getAge());
        assertEquals("boy", req.getGender());
        assertEquals("url", req.getAvatarUrl());
        assertEquals("pid", req.getParentId());
    }
} 