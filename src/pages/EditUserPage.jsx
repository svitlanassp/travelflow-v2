import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../services/api'
import Input from '../components/UI/Input'
import Header from '../components/Header/Header'
import './AuthPage.css'

function EditUserPage() {
    const { id } = useParams() 
    const navigate = useNavigate()
    
    const [username, setUsername] = useState('')
    const [role, setRole] = useState('regular')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await api.getUser(id)
                setUsername(data.username)
                setRole(data.is_staff ? 'admin' : 'regular')
            } catch (err) {
                setError('failed to load user data')
            } finally {
                setIsLoading(false)
            }
        }
        fetchUser()
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            await api.updateUser(id, { username, role })
            navigate('/users')
        } catch (err) {
            setError('failed to update user')
        }
    }

    if (isLoading) return <div className="app-wrapper"><Header /><div className="auth-container"><p>loading...</p></div></div>

    return (
        <div className="app-wrapper">
            <Header />
            <div className="auth-container">
                <form className="auth-card" onSubmit={handleSubmit}>
                    <h1 className="auth-title">edit user</h1>

                    {error && <p className="auth-error">{error}</p>}

                    <Input label="username" placeholder="enter username" value={username} onChange={e => setUsername(e.target.value)} />

                    <div className="input-group">
                        <label className="input-label">role</label>
                        <select className="input-field" value={role} onChange={e => setRole(e.target.value)}>
                            <option value="regular">regular</option>
                            <option value="admin">admin</option>
                        </select>
                    </div>

                    <div className="auth-actions">
                        <button type="button" className="btn-secondary" onClick={() => navigate('/users')}>cancel</button>
                        <button type="submit" className="btn-go">save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditUserPage