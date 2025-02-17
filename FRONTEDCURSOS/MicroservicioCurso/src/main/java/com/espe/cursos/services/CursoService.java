package com.espe.cursos.services;
import com.espe.cursos.model.entities.Curso;
import com.espe.cursos.model.Student;

import java.util.List;
import java.util.Optional;

public interface CursoService {
    List<Curso> findAll();
    Curso save(Curso curso);
    Optional<Curso> findById(Long id);
    void deleteById(Long id);


    Optional<Student> addUser(Student student, Long id);
}
