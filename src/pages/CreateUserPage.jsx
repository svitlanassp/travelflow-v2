import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import Input from '../components/UI/Input'
import Header from '../components/Header/Header'
import './AuthPage.css' 

function CreateUserPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [role, setRole] = useState('regular')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('passwords do not match')
            return
        }

        try {
            await api.createUser({ username, password, role })
            navigate('/users') 
        } catch {
            setError('failed to create user. username might be taken.')
        }
    }

    return (
        <div className="app-wrapper">
            <Header />
            <div className="centered-container">
                <form className="card auth-card" onSubmit={handleSubmit}>
                    <h1 className="auth-title">create user</h1>

                    {error && <p className="auth-error">{error}</p>}

                    <Input label="username" placeholder="enter username" value={username} onChange={e => setUsername(e.target.value)} />
                    <Input label="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                    <Input label="confirm password" type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />

                    <div className="input-group">
                        <label className="input-label">role</label>
                        <select className="input-field" value={role} onChange={e => setRole(e.target.value)}>
                            <option value="regular">regular</option>
                            <option value="admin">admin</option>
                        </select>
                    </div>

                    <div className="auth-actions">
                        <button type="button" className="btn-secondary" onClick={() => navigate('/users')}>cancel</button>
                        <button type="submit" className="btn-primary btn-go">confirm</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateUserPage