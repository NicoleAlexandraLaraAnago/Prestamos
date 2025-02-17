// studentService.ts
const API_URL: string = "http://localhost:8003/api/estudiantes";

interface Student {
  id?: number; // id es opcional al crear un nuevo estudiante
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: string;
  telefono: string;
}

// Función genérica para peticiones HTTP
async function fetchData<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("❌ Error en fetchData:", error);
    throw error;
  }
}

// Obtener todos los estudiantes
export async function obtenerEstudiantes(): Promise<Student[]> {
  return await fetchData<Student[]>(API_URL);
}

// Obtener un estudiante por ID
export async function getEstudianteById(id: number): Promise<Student> {
  return await fetchData<Student>(`${API_URL}/${id}`);
}

// Agregar un nuevo estudiante
export async function agregarEstudiante(studentData: Student): Promise<Student> {
  const options: RequestInit = {
    method: "POST",
    body: JSON.stringify(studentData),
  };

  return await fetchData<Student>(API_URL, options);
}
// services/studentService.ts

export async function eliminarEstudiante(id: string) {
  const response = await fetch(`/api/estudiantes/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('No se pudo eliminar el estudiante');
  }

  return response.json();
}
// Actualizar un estudiante por ID
export async function actualizarEstudiante(id: number, studentData: Student): Promise<Student> {
  const options: RequestInit = {
    method: "PUT",
    body: JSON.stringify(studentData),
  };

  return await fetchData<Student>(`${API_URL}/${id}`, options);
}
