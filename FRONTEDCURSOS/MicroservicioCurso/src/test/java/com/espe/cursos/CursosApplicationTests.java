package com.espe.cursos;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootTest
@ActiveProfiles("test")  // Asegura que se use application-test.properties
class CursosApplicationTests {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void contextLoads() {
        // Verifica que la base de datos se haya configurado correctamente
        Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM estudiantes", Long.class);
        assert(count >= 0);  // Realiza una comprobación simple
    }
}
