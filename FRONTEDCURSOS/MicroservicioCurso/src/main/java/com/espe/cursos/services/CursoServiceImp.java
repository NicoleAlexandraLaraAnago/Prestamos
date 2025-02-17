package com.espe.cursos.services;
import com.espe.cursos.clients.usuarioClientRest;
import com.espe.cursos.model.entities.Curso;
import com.espe.cursos.model.entities.CursoUsuario;
import com.espe.cursos.model.Student;
import com.espe.cursos.repositories.CursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CursoServiceImp implements CursoService {
    @Autowired
    private CursoRepository cursoRepository;
    @Override
    public List<Curso> findAll() {
        return (List<Curso>) cursoRepository.findAll();
    }

    @Autowired
    private usuarioClientRest clientRest;


    @Override
    public Curso save(Curso curso) {
        return cursoRepository.save(curso);
    }
    @Override
    public Optional<Curso> findById(Long id) {
        return cursoRepository.findById(id);
    }
    @Override
    public void deleteById(Long id) {
        cursoRepository.deleteById(id);
    }


    @Override
    public Optional<Student> addUser(Student student, Long id) {
        Optional<Curso> optional = cursoRepository.findById(id);
        if (optional.isPresent()) {
            Student usuarioTemp = clientRest.findById(student.getId());

            Curso curso = optional.get();
            CursoUsuario cursoUsuario = new CursoUsuario();

            cursoUsuario.setUsuarioId(usuarioTemp.getId());

            curso.addCursoUsuario(cursoUsuario);
            cursoRepository.save(curso);
            return Optional.of(usuarioTemp);

        }
        return Optional.empty();
    }
}
