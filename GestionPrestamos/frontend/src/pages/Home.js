// Home.js - Página de inicio
import React from 'react';
import Navbar from "../components/Navbar";

const Home = () => {
    return (
      <div>
        <Navbar />
        <h1 style={{ textAlign: "center", color: "#027333" }}>Servicio de Préstamos</h1>
        <img 
          src="fondo.jpg" 
          alt="Descripción de la imagen" 
          style={{ display: 'block', margin: '20px auto', maxWidth: '25%' }} 
        />
      </div>
    );
};

export default Home;
