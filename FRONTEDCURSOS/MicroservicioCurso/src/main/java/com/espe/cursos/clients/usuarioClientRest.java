package com.espe.cursos.clients;


import com.espe.cursos.model.Student;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "cursos", url = "http://localhost:8003/api/estudiantes")
public interface usuarioClientRest {
    @GetMapping("/{id}")
    Student findById(@PathVariable Long id);

}
