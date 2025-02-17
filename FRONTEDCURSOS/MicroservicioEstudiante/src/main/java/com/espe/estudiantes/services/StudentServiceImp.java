package com.espe.estudiantes.services;
import com.espe.estudiantes.model.entities.Student;
import com.espe.estudiantes.repositories.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class StudentServiceImp implements StudentService {
    @Autowired
    private StudentRepository studentRepository;
    @Override
    public List<Student> findAll() {
        return (List<Student>) studentRepository.findAll();
    }

    @Override
    public Student save(Student estudiante) {
        return studentRepository.save(estudiante);
    }
    @Override
    public Optional<Student> findById(Long id) {
        return studentRepository.findById(id);
    }
    @Override
    public void deleteById(Long id) {
        studentRepository.deleteById(id);
    }
}