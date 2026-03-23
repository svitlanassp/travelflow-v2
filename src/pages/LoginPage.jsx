import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Auth } from '../services/auth';

import Input from '../components/UI/Input';
import Header from '../components/Header/Header';
import './AuthPage.css';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const [error, setError] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const data = await api.login({ username, password })
            if (data && data.access) {
                Auth.setToken(data.access)
                navigate('/trips')
            }
        } catch {
            setError('invalid username or password')
        }
    };

    return (
        <div className="app-wrapper">
            <Header hideAvatar />
            <div className="auth-container">
                <form className="auth-card" onSubmit={handleLogin}>
                    <h1 className="auth-title">sign in</h1>
                    <p className="auth-subtitle">to continue your adventures ✦</p>
                    {error && <p className="auth-error">{error}</p>}
                    <Input
                        label="username"
                        placeholder="your username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <Input
                        label="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />

                    <button type="submit" className="btn-go">→ go</button>

                    <p className="auth-link">
                        no account yet? <a href="/register" onClick={(e) => {
                            e.preventDefault()
                            navigate('/register')
                        }}>sign up</a>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default LoginPage