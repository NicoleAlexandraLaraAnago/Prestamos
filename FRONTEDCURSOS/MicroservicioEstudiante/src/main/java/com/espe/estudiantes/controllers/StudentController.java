package com.espe.estudiantes.controllers;

import com.espe.estudiantes.model.entities.Student;
import com.espe.estudiantes.services.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/estudiantes")
@CrossOrigin(origins = "http://localhost:5500")

public class StudentController {
    @Autowired
    private StudentService service;

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Student student){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(student));
    }

    @GetMapping
    public List<Student> listar() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> bucarPorId(@PathVariable Long id) {
        Optional<Student> estudianteOptional = service.findById(id);
        if (estudianteOptional.isPresent()) {
            return ResponseEntity.ok().body(estudianteOptional.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editar(@RequestBody Student student, @PathVariable Long id) {
        Optional<Student> estudianteOptional = service.findById(id);
        if (estudianteOptional.isPresent()) {
            Student studentDB = estudianteOptional.get();
            studentDB.setNombre(student.getNombre());
            studentDB.setApellido(student.getApellido());
            studentDB.setEmail(student.getEmail());
            studentDB.setFechaNacimiento(student.getFechaNacimiento());
            studentDB.setTelefono(student.getTelefono());
            return ResponseEntity.status(HttpStatus.CREATED).body(service.save(studentDB));
        }
        return ResponseEntity.notFound().build();
    }
}
