import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";

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

const Login = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [showCodeInput, setShowCodeInput] = useState(false);
    const navigate = useNavigate();

    const sendCode = async () => {
        if (!email) {
            setMessage('Por favor, ingresa tu correo electrónico');
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/auth/send-code', { email });
            setMessage('Código enviado a tu correo');
            setShowCodeInput(true);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error al enviar el código');
        }
    };

    const verifyCode = async () => {
        console.log('Verificando código');
        try {
            console.log('Verificado código 1');
            await axios.post('http://localhost:5000/api/auth/verify-code', { email, code });
            navigate('/pages/Dashboard/Dashboard');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Código incorrecto');
        }
    };

    return (
        <LoginWrapper>
            <LoginForm>
                <h2>Login</h2>
                <Input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={sendCode}>Enviar Código</button>
                {showCodeInput && (
                    <>
                        <Input
                            type="text"
                            placeholder="Código de verificación"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <button type="button" onClick={verifyCode}>Confirmar</button>
                    </>
                )}
                <p>{message}</p>
            </LoginForm>
        </LoginWrapper>
    );
};

export default Login;