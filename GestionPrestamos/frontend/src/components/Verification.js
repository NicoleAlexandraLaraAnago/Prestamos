import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Verification = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const sendCode = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/send-code', { email });
            setMessage('Código enviado a tu correo');
        } catch (error) {
            setMessage('Error al enviar el código');
        }
    };

    const verifyCode = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/verify-code', { email, code });
            if (response.data.success) {
                console.log('Código verificado');
                navigate('/pages/Dashboard');
            } else {
                setMessage('Código incorrecto');
            }
        } catch (error) {
            console.error('Error al verificar el código:', error);
            setMessage('Error al verificar el código');
        }
    };

    return (
        <div>
            <h2>Verificación de Código</h2>
            <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={sendCode}>Enviar Código</button>
            <br />
            <input
                type="text"
                placeholder="Código de verificación"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
            <button onClick={verifyCode}>Confirmar</button>
            <br />
            <button onClick={() => window.location.href = '/'}>Regresar al Inicio</button>
            <p>{message}</p>
        </div>
    );
};

export default Verification;