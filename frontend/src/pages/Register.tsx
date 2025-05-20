import React, { useState } from 'react';
import { register } from '../api/auth';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            await register(username, email, password);
            alert('Inscription réussie!');
        } catch (err) {
            alert('Erreur lors de l\'inscription');
        }
    };

    return (
        <div>
            <h2>Inscription</h2>
            <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
            <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
            <button onClick={handleRegister}>S'inscrire</button>
        </div>
    );
};

export default Register;
