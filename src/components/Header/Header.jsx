import { useState, useEffect, useRef } from 'react'
import logo from '../../assets/logo.png'
import { useNavigate } from 'react-router-dom'
import { Auth } from '../../services/auth'
import UsersIcon from '../../icons/users.svg?react' 
import LogoutIcon from '../../icons/logout.svg?react'
import './Header.css'

function Header({ hideAvatar = false }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)
    const navigate = useNavigate()
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const userRole = Auth.getRole()

    const username = Auth.getUsername();
    const avatarLetter = username ? username.charAt(0) : 'U';

    const handleLogout = () => {
        Auth.logout() 
        setIsDropdownOpen(false); 
        navigate('/login'); 
    }

    return (
        <header className="header-card">
            <div className="header-logo">
                <img src={logo} alt="logo" className="logo-icon" />
                <span className="logo-text">travelflow</span>
            </div>
            
            {!hideAvatar && (
                <div className="header-user-section" ref={dropdownRef}>
                    <div 
                        className="header-avatar" 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        {avatarLetter}
                    </div>
                    
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            {userRole === 'admin' && (
                                <button className="dropdown-item dropdown-item--users" onClick={() => navigate('/users')}>
                                    <UsersIcon />
                                    users
                                </button>
                            )}
                            <button className="dropdown-item dropdown-item--logout" onClick={handleLogout}>
                                <LogoutIcon />
                                logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </header>
    )
}

export default Header