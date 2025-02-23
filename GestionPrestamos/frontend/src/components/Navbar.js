import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background:rgb(255, 255, 255);

`;

const Logo = styled.img`
  height: 60px;  // Ajusta el tamaño de la imagen
  width: auto;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 15px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
  background: #025928;
  padding: 8px 12px;
  border-radius: 5px;
  transition: background 0.3s;

  &:hover {
    background: #82BF45;
  }
`;

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <Nav>
      <Logo src="/produbanco.jpg" alt="Logo" /> {/* Ruta correcta a la imagen en public */}
      <NavLinks>
        {user ? (
          <>
            <span>Hola, {user.nombre}</span>
            <StyledLink to="/" onClick={logout}>Cerrar Sesión</StyledLink>
          </>
        ) : (
          <>
            <StyledLink to="/login">Iniciar Sesión</StyledLink>
            <StyledLink to="/register">Registrarse</StyledLink>
          </>
        )}
      </NavLinks>
    </Nav>
  );
};

export default Navbar;
