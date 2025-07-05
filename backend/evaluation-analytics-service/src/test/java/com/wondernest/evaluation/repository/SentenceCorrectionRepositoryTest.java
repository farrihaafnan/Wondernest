package com.wondernest.evaluation.repository;

import com.wondernest.evaluation.model.SentenceCorrection;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class SentenceCorrectionRepositoryTest {
    @Autowired
    private SentenceCorrectionRepository repo;

    @Test
    public void testSaveAndFindById() {
        SentenceCorrection sc = new SentenceCorrection();
        sc.setChildId(UUID.randomUUID());
        sc.setScore(7);
        SentenceCorrection saved = repo.save(sc);
        assertNotNull(saved.getId());
        SentenceCorrection found = repo.findById(saved.getId()).orElse(null);
        assertNotNull(found);
        assertEquals(7, found.getScore());
    }
} 