package com.wondernest.userlearning.repository;

import com.wondernest.userlearning.model.Child;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class ChildRepositoryTest {
    @Autowired
    private ChildRepository childRepository;

    @Test
    public void testSaveAndFindById() {
        Child child = new Child();
        child.setName("Test Child");
        child.setAge(8);
        child.setGender("boy");
        child.setAvatarUrl("url");
        Child saved = childRepository.save(child);
        assertNotNull(saved.getId());
        Child found = childRepository.findById(saved.getId()).orElse(null);
        assertNotNull(found);
        assertEquals("Test Child", found.getName());
    }
} 