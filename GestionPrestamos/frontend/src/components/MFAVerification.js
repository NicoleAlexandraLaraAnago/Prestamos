// src/components/MFAVerification.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MFAVerification = () => {
  const [codigoMFA, setCodigoMFA] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Este es el token JWT que deberías haber recibido en la pantalla de login
  const token = localStorage.getItem('token'); // Asumiendo que el token está guardado en el localStorage

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        '/api/verificar-mfa', // Ruta de la verificación MFA en el backend
        { codigo: codigoMFA },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        navigate('/Dashboard'); // Redirige al Dashboard si la autenticación es exitosa
      }
    } catch (err) {
      setError('Código MFA incorrecto. Inténtalo de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ textAlign: 'center', width: '300px' }}>
        <h2>Verificar Código MFA</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <input
            type="text"
            value={codigoMFA}
            onChange={(e) => setCodigoMFA(e.target.value)}
            placeholder="Introduce tu código MFA"
            disabled={loading}
            style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
          />
        </div>
        <button type="submit" disabled={loading || !codigoMFA}>
          {loading ? 'Verificando...' : 'Verificar Código'}
        </button>
      </form>
    </div>
  );
};

export default MFAVerification;
