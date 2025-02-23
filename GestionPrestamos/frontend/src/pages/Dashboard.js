import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  /*const [loans, setLoans] = useState([]);
  const [payments, setPayments] = useState([]);*/

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      // Cargar información del usuario
    }
  }, [user, navigate]);

  return (
    <div>
      <h2>Bienvenido, {user?.name}</h2>
      <div>
        <h3>Solicitar Préstamo</h3>
        {/* Formulario para solicitar préstamo */}
      </div>
      <div>
        <h3>Mis Préstamos</h3>
        {/* Lista de préstamos */}
      </div>
      <div>
        <h3>Mis Pagos</h3>
        {/* Lista de pagos */}
      </div>
      <button onClick={() => { logout(); navigate("/login"); }}>Cerrar sesión</button>
    </div>
  );
};

export default Dashboard;
