const API_URL: string = "http://localhost:8002/api/cursos";

// Definición de la interfaz para un curso
interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  creditos: number;
}

// Función para obtener todos los cursos
export async function obtenerCursos(): Promise<Curso[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Error al obtener cursos: ${response.status}`);
  }
  return await response.json();
}

// Función para obtener un curso por su ID
export async function getCursoById(id: number): Promise<Curso> {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Error al obtener curso con id: ${id}, error: ${response.status}`);
  }
  return await response.json();
}

// Función para agregar un curso
export async function agregarCurso(cursoData: Omit<Curso, "id">): Promise<Curso> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cursoData),
  });

  if (!response.ok) {
    throw new Error("Error al agregar curso");
  }

  return await response.json();
}
export async function actualizarCurso(id: number, cursoData: Omit<Curso, "id">): Promise<Curso> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cursoData),
  });

  if (!response.ok) {
    throw new Error(`Error al actualizar curso con id: ${id}, error: ${response.status}`);
  }

  return await response.json();
}
// Función para agregar un estudiante a un curso
// services/cursoService.ts

export const agregarEstudiante = async (cursoId: number, estudiante: any) => {
  const response = await fetch(`http://localhost:8002/api/cursos/${cursoId}/estudiantes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(estudiante), // Enviar solo el ID del estudiante
  });

  if (!response.ok) {
    throw new Error('Error al agregar estudiante');
  }
  return await response.json();
};

