package com.wondernest.evaluation.model;

import org.junit.jupiter.api.Test;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

public class WordMatchingResultTest {
    @Test
    public void testSettersAndGetters() {
        WordMatchingResult wm = new WordMatchingResult();
        UUID id = UUID.randomUUID();
        UUID childId = UUID.randomUUID();
        wm.setId(id);
        wm.setChildId(childId);
        wm.setLetterRange("A-B");
        wm.setScore(10);
        assertEquals(id, wm.getId());
        assertEquals(childId, wm.getChildId());
        assertEquals("A-B", wm.getLetterRange());
        assertEquals(10, wm.getScore());
    }

    @Test
    public void testEqualsAndHashCode() {
        WordMatchingResult w1 = new WordMatchingResult();
        WordMatchingResult w2 = new WordMatchingResult();
        UUID id = UUID.randomUUID();
        w1.setId(id);
        w2.setId(id);
        assertEquals(w1, w2);
        assertEquals(w1.hashCode(), w2.hashCode());
    }

    @Test
    public void testToString() {
        WordMatchingResult wm = new WordMatchingResult();
        wm.setLetterRange("A-B");
        assertTrue(wm.toString().contains("A-B"));
    }
} 