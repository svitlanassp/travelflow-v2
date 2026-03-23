import { useState } from 'react'
import Input from '../components/UI/Input'
import Header from '../components/Header/Header'
import './AuthPage.css'

function RegisterPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    return (
        <div className="app-wrapper">
            <Header hideAvatar />
            <div className="auth-container">
                <div className="auth-card">
                    <h1 className="auth-title">sign up</h1>
                    <p className="auth-subtitle">to start your adventures ✦</p>

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

                    <button className="btn-go">→ go</button>

                    <p className="auth-link">
                        already have an account? <a href="/login">sign in</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage