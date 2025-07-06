package com.wondernest.evaluation.repository;

import com.wondernest.evaluation.model.WordMatchingResult;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class WordMatchingResultRepositoryTest {
    @Autowired
    private WordMatchingResultRepository repo;

    @Test
    public void testSaveAndFindById() {
        WordMatchingResult wm = new WordMatchingResult();
        wm.setChildId(UUID.randomUUID());
        wm.setLetterRange("A-B");
        wm.setScore(10);
        WordMatchingResult saved = repo.save(wm);
        assertNotNull(saved.getId());
        WordMatchingResult found = repo.findById(saved.getId()).orElse(null);
        assertNotNull(found);
        assertEquals("A-B", found.getLetterRange());
    }
} 