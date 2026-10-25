package com.skillswap;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class SkillSwapApplicationTests {

    @Test
    void contextLoads() {
        // Verifies that the Spring application context, JPA configuration,
        // and entity mappings load successfully with test configuration.
    }
}
