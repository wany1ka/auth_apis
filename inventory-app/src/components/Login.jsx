import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setRole }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:8000/accounts/api/login/', { email, password });
            const { access, refresh, role } = response.data;

            localStorage.setItem('access', access);
            localStorage.setItem('refresh', refresh);
            localStorage.setItem('role', role);
            setRole(role);

            if (role === 'admin') {
                navigate('/admin-dashboard');
            } else if (role === 'manager') {
                navigate('/manager-dashboard');
            } else if (role === 'employee') {
                navigate('/employee-dashboard');
            } else {
                navigate('/'); // Default fallback
            }
        } catch (error) {
            setError('Invalid credentials');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Login</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

export default Login;
