import { useState, useEffect } from 'react'
import Header from '../components/Header/Header'
import EditIcon from '../icons/edit.svg?react';
import DeleteIcon from '../icons/delete.svg?react';
import { api } from '../services/api'
import './UsersPage.css'
 
function UsersPage() {
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true)
                const data = await api.getUsers()

                const formattedUsers = data.map(u => ({
                    id: u.id,
                    username: u.username,
                    role: u.is_staff ? 'admin' : 'regular'
                }))
                    
                setUsers(formattedUsers)
            } catch (err) {
                setError('failed to load users. backend might be sleeping zZz')
            } finally {
                setIsLoading(false)
            }
        }

        fetchUsers()
    }, [])

    return (
        <div className="app-wrapper">
            <Header />
            <div className="users-container">
                <div className="users-card">
                    <div className="users-card-header">
                        <h1 className="users-title">users</h1>
                        <button className="btn-add-user">+ add</button>
                    </div>

                    {isLoading ? (
                        <div className="empty-state-wrapper">
                            <p className="empty-state-text">loading users... ✦</p>
                        </div>
                    ) : error ? (
                        <div className="empty-state-wrapper">
                            <p className="empty-state-text error-text">{error}</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="empty-state-wrapper">
                            <p className="empty-state-text">no users found yet</p>
                        </div>
                    ) : (
                        <div className="table-scroll-container">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>username</th>
                                        <th>role</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td>
                                                <span className="username-text">
                                                    {user.username}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`role-badge role-${user.role}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="actions-cell">
                                                <button className="icon-btn icon-btn--edit" title="edit">
                                                    <EditIcon />
                                                </button>
                                                
                                                <button className="icon-btn icon-btn--delete" title="delete">
                                                    <DeleteIcon />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
 
export default UsersPage