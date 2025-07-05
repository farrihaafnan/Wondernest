package com.wondernest.evaluation.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class CheckRequestTest {
    @Test
    public void testSettersAndGetters() {
        CheckRequest req = new CheckRequest();
        req.setOriginal("orig");
        req.setUserCorrection("corr");
        assertEquals("orig", req.getOriginal());
        assertEquals("corr", req.getUserCorrection());
    }
} 