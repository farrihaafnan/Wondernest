package com.wondernest.evaluation.model;

import org.junit.jupiter.api.Test;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

public class SentenceCorrectionTest {
    @Test
    public void testSettersAndGetters() {
        SentenceCorrection sc = new SentenceCorrection();
        UUID id = UUID.randomUUID();
        UUID childId = UUID.randomUUID();
        sc.setId(id);
        sc.setChildId(childId);
        sc.setScore(8);
        assertEquals(id, sc.getId());
        assertEquals(childId, sc.getChildId());
        assertEquals(8, sc.getScore());
    }

    @Test
    public void testEqualsAndHashCode() {
        SentenceCorrection s1 = new SentenceCorrection();
        SentenceCorrection s2 = new SentenceCorrection();
        UUID id = UUID.randomUUID();
        s1.setId(id);
        s2.setId(id);
        assertEquals(s1, s2);
        assertEquals(s1.hashCode(), s2.hashCode());
    }

    @Test
    public void testToString() {
        SentenceCorrection sc = new SentenceCorrection();
        sc.setScore(5);
        assertTrue(sc.toString().contains("5"));
    }
} 