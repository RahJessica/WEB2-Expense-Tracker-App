import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Réinitialise l'erreur à chaque tentative

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError("Email ou mot de passe incorrect. Vous n'avez peut-être pas encore de compte.");
        } else {
          setError("Une erreur est survenue lors de la connexion.");
        }
        return;
      }

      const data = await res.json();
      localStorage.setItem('token', data.token); // Sauvegarde le token
      navigate('/dashboard'); // Redirige vers le dashboard ou une autre page protégée
    } catch (err) {
      console.error(err);
      setError("Erreur réseau. Impossible de contacter le serveur.");
    }
  };


};

export default Login;
