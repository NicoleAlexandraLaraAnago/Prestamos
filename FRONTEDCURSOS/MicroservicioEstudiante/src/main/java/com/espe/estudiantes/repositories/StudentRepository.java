package com.espe.estudiantes.repositories;
import com.espe.estudiantes.model.entities.Student;
import org.springframework.data.repository.CrudRepository;

public interface StudentRepository extends CrudRepository<Student, Long> {
}
