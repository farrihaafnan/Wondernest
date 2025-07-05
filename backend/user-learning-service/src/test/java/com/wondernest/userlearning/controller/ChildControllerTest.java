package com.wondernest.userlearning.controller;

import com.wondernest.userlearning.dto.ChildDto;
import com.wondernest.userlearning.model.Child;
import com.wondernest.userlearning.repository.ChildRepository;
import com.wondernest.userlearning.repository.ParentRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.util.List;
import java.util.UUID;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ChildController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ChildControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ChildRepository childRepository;

    @MockBean
    private ParentRepository parentRepository;

    @Test
    public void testGetChildrenByParent() throws Exception {
        UUID mockParentId = UUID.randomUUID();
        Child child = new Child();
        child.setId(UUID.randomUUID());
        child.setName("Test Child");
        Mockito.when(childRepository.findByParentId(any(UUID.class))).thenReturn(List.of(child));

        mockMvc.perform(get("/api/parents/" + mockParentId + "/children"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].name").value("Test Child"));
    }
} 