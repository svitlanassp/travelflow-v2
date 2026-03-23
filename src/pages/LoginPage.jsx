import { useState } from 'react'
import Input from '../components/UI/Input'
import Header from '../components/Header/Header'
import './AuthPage.css'

function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    return (
        <div className="app-wrapper">
            <Header hideAvatar />
            <div className="auth-container">
                <div className="auth-card">
                    <h1 className="auth-title">sign in</h1>
                    <p className="auth-subtitle">to continue your adventures ✦</p>

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

                    <button className="btn-go">→ go</button>

                    <p className="auth-link">
                        no account yet? <a href="/register">sign up</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage