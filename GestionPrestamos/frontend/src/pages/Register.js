import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import FormContainer from "../components/Form";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    nombre_completo: "",
    identificacion: "",
    fecha_nacimiento: "",
    direccion: "",
    correo: "",
    contrasena: "",
    sueldo: "",
    carga_familiar: "",
    historial_crediticio: "",
    rol: "USUARIO", // Valor predeterminado para el rol
  });

  const navigate = useNavigate();

  // Actualiza el estado de los campos del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const response = await registerUser(form);
  
    if (response.success) {
      alert(response.mensaje); // Ahora el mensaje de éxito está asegurado
      localStorage.setItem("usuario", JSON.stringify(response.usuario)); 
      navigate("/login");
    } else {
      alert("Error al registrar: " + (response.mensaje || "Error desconocido"));
    }
  };
  

  return (
    <FormContainer onSubmit={handleSubmit}>
      <h2 style={{ textAlign: "center", color: "#025928" }}>Registro</h2>
      <Input
        label="Nombre Completo"
        type="text"
        name="nombre_completo"
        value={form.nombre_completo}
        onChange={handleChange}
      />
      <Input
        label="Identificación"
        type="text"
        name="identificacion"
        value={form.identificacion}
        onChange={handleChange}
      />
      <Input
        label="Fecha de Nacimiento"
        type="date"
        name="fecha_nacimiento"
        value={form.fecha_nacimiento}
        onChange={handleChange}
      />
      <Input
        label="Dirección"
        type="text"
        name="direccion"
        value={form.direccion}
        onChange={handleChange}
      />
      <Input
        label="Correo Electrónico"
        type="email"
        name="correo"
        value={form.correo}
        onChange={handleChange}
      />
      <Input
        label="Contraseña"
        type="password"
        name="contrasena"
        value={form.contrasena}
        onChange={handleChange}
      />
      <Input
        label="Sueldo"
        type="number"
        name="sueldo"
        value={form.sueldo}
        onChange={handleChange}
      />
      <Input
        label="Carga Familiar"
        type="number"
        name="carga_familiar"
        value={form.carga_familiar}
        onChange={handleChange}
      />
      <Input
        label="Historial Crediticio"
        type="text"
        name="historial_crediticio"
        value={form.historial_crediticio}
        onChange={handleChange}
      />
      <Button text="Registrarse" />
    </FormContainer>
  );
};

export default Register;
