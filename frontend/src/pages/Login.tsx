import React, { useState } from 'react';
import { login } from '../api/auth';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await login(email, password);
            alert(`Bienvenue ${response.data.username}`);
            localStorage.setItem('token', response.data.token);
        } catch (err) {
            alert('Identifiants incorrects');
        }
    };

    return (
        <div>
            <h2>Connexion</h2>
            <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Se connecter</button>
        </div>
    );
};

export default Login;
