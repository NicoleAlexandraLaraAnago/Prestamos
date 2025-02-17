package com.espe.estudiantes.services;


import com.espe.estudiantes.model.entities.Student;

import java.util.List;
import java.util.Optional;

public interface StudentService {
    List<Student> findAll();
    Student save(Student student);
    Optional<Student> findById(Long id);
    void deleteById(Long id);

}
