import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); 
    const auth = useAuth();

    useEffect(() => {
        // Redirect if already authenticated
        if (auth.isAuthenticated) {
            navigate('/checklist');
        }
    }, [auth.isAuthenticated, navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === 'demo' && password === 'demo') {
            login();
            console.log('login success');
            navigate('/checklist');
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <div className="app">
            <div className="login-container">
                <div className="login-form">
                    <img src="/logo.png" alt="Logo" style={{ maxHeight: '45px' }} />
                    <div style={{ marginTop: '105px' }}>
                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input 
                                  type="text" 
                                  id="username" 
                                  name="username" 
                                  value={username}
                                  onChange={(e) => setUsername(e.target.value)}
                                  required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input 
                                  type="password" 
                                  id="password" 
                                  name="password" 
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  required 
                                />
                            </div>
                            <button type="submit">Login</button>
                        </form>
                    </div>
                </div>
                <div className="login-image">
                    {/* Image content */}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
