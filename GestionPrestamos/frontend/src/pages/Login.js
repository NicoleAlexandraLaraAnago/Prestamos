import React, { useState, useContext } from "react";
import styled from "styled-components";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(#F2F2F2);
`;

const LoginForm = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const ForgotPasswordLink = styled.a`
  display: block;
  margin-top: 10px;
  color: #025928;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const MFAInputWrapper = styled.div`
  margin-top: 20px;
`;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mfaRequired, setMfaRequired] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await login(username, password);
      if (result?.success) {
        if (result.mfaRequired) {
          setMfaRequired(true);
        } else {
          navigate("/Dashboard");
        }
      } else {
        setError(result?.mensaje || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  const handleMFA = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await login(username, password, mfaCode);
      if (result?.success) {
        navigate("/Dashboard");
      } else {
        setError(result?.mensaje || "Error al verificar el código MFA");
      }
    } catch (err) {
      setError("Error al procesar el código MFA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginWrapper>
      <LoginForm>
        <h2>Iniciar Sesión</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!mfaRequired ? (
          <>
            <Input
              type="text"
              placeholder="Correo Electrónico"
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
            <Input
              type="password"
              placeholder="Contraseña"
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              text={loading ? "Cargando..." : "Iniciar Sesión"}
              onClick={handleLogin}
              disabled={loading || !username || !password}
            />
            <ForgotPasswordLink href="#">Olvidé mi contraseña</ForgotPasswordLink>
          </>
        ) : (
          <MFAInputWrapper>
            <Input
              type="text"
              placeholder="Código MFA"
              onChange={(e) => setMfaCode(e.target.value)}
              disabled={loading}
            />
            <Button
              text={loading ? "Cargando..." : "Verificar Código"}
              onClick={handleMFA}
              disabled={loading || !mfaCode}
            />
          </MFAInputWrapper>
        )}
      </LoginForm>
    </LoginWrapper>
  );
};

export default Login;
