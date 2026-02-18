import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Profile from './pages/Profile'; 
import Album from './pages/Album';
import Artist from './pages/Artist';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function App() {

  // Estado para saber se está logado
  // inicializa tentando ler do localstorage prra manter logado ao dar F5
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('scorefy_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('scorefy_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('scorefy_user');
  };

  // Componente para proteger rotas
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />

        {/* Rotas que exigem login */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home user={user} onLogout={handleLogout} /> 
          </ProtectedRoute>
        } />

        <Route path="/" element={
          <ProtectedRoute>
            <Home user={user} onLogout={handleLogout} /> 
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile user={user} />
          </ProtectedRoute>
        } />

        <Route path="/album/:id" element={
          <ProtectedRoute>
            <Album />
          </ProtectedRoute>
        } />

        <Route path="/artist/:artistName" element={
          <ProtectedRoute>
            <Artist />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;