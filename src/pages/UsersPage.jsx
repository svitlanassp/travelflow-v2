import { useState, useEffect } from 'react'
import Header from '../components/Header/Header'
import EditIcon from '../icons/edit.svg?react';
import DeleteIcon from '../icons/delete.svg?react';
import { api } from '../services/api'
import { useNavigate } from 'react-router-dom'
import './UsersPage.css'
import ConfirmModal from '../components/UI/ConfirmModal';
 
function UsersPage() {
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false) 

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
            } catch {
                setError('failed to load users. backend might be sleeping zZz')
            } finally {
                setIsLoading(false)
            }
        }

        fetchUsers()
    }, [])

    const handleDeleteClick = (user) => {
        setUserToDelete(user)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setUserToDelete(null)
    }

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;
        
        try {
            setIsDeleting(true)
            await api.deleteUser(userToDelete.id) 
            
            setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id))
            
            handleCloseModal()
        } catch {
            alert('failed to delete user. maybe they are immortal? 🧛')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="app-wrapper">
            <Header />
            <div className="centered-container">
                <div className="card users-card">
                    <div className="users-card-header">
                        <h1 className="users-title">users</h1>
                        <button className="btn-primary" onClick={() => navigate('/users/new')}>+ add</button>
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
                                                <button className="icon-btn icon-btn--edit" title="edit" onClick={() => navigate(`/users/${user.id}/edit`)}>
                                                    <span className="icon">
                                                        <EditIcon />
                                                    </span>
                                                </button>
                                                
                                                <button className="icon-btn icon-btn--delete" title="delete" onClick={() => handleDeleteClick(user)}>
                                                    <span className="icon">
                                                        <DeleteIcon />
                                                    </span>
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

            <ConfirmModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                title="Delete user?"
                message={
                    <>
                        Are you sure you want to delete <strong>{userToDelete?.username}</strong>? 
                        This action cannot be undone.
                    </>
                }
                confirmText="delete"
                isProcessing={isDeleting}
            />
        </div>
    )
}
 
export default UsersPage