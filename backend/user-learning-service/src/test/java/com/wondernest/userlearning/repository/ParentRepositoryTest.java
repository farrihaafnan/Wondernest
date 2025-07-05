package com.wondernest.userlearning.repository;

import com.wondernest.userlearning.model.Parent;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class ParentRepositoryTest {
    @Autowired
    private ParentRepository parentRepository;

    @Test
    public void testSaveAndFindById() {
        Parent parent = new Parent();
        parent.setEmail("parent@example.com");
        Parent saved = parentRepository.save(parent);
        assertNotNull(saved.getId());
        Parent found = parentRepository.findById(saved.getId()).orElse(null);
        assertNotNull(found);
        assertEquals("parent@example.com", found.getEmail());
    }
} 