package com.hereandalways.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import com.hereandalways.BackendApplication;
import com.hereandalways.config.SecurityConfig;

@SpringBootTest(classes = {BackendApplication.class, SecurityConfig.class})
class BackendApplicationTests {

  @Test
  void contextLoads() {}
}
