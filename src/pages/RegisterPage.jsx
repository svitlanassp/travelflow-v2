import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import Input from '../components/UI/Input'
import Header from '../components/Header/Header'
import './AuthPage.css'

function RegisterPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const navigate = useNavigate()

    const [error, setError] = useState('')

    const handleRegister = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError('passwords don\'t match')
            return
        }
        try {
            await api.register({ username, password, password_confirm: confirmPassword })
            navigate('/login')
        } catch {
            setError('something went wrong, try again')
        }
    };

    return (
        <div className="app-wrapper">
            <Header hideAvatar />
            <div className="centered-container">
                <form className="card auth-card" onSubmit={handleRegister}>
                    <h1 className="auth-title">sign up</h1>
                    <p className="auth-subtitle">to start your adventures ✦</p>
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
                    <Input
                        label="confirm password"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />

                    <button type="submit" className="btn-primary btn-go">→ go</button>

                    <p className="auth-link">
                        already have an account? <a href="/login" onClick={(e) => {
                            e.preventDefault()
                            navigate('/login')
                        }}>sign in</a>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default RegisterPage