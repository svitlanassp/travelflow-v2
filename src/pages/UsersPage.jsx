import Header from '../components/Header/Header'
import EditIcon from '../icons/edit.svg?react';
import DeleteIcon from '../icons/delete.svg?react';
import './UsersPage.css'
 
const mockUsers = [
    { id: 1, username: 'ivan_traveler', role: 'admin' },
    { id: 2, username: 'olena_traveler', role: 'regular' },
]
 
function UsersPage() {
    return (
        <div className="app-wrapper">
            <Header />
            <div className="users-container">
                <div className="users-card">
                    <div className="users-card-header">
                        <h1 className="users-title">users</h1>
                        <button className="btn-add-user">+ add</button>
                    </div>
 
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>username</th>
                                <th>role</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockUsers.map(user => (
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
            </div>
        </div>
    )
}
 
export default UsersPage