import logo from '../../assets/logo.png'
import './Header.css'

function Header({ hideAvatar = false }) {
    return (
        <header className="header-card">
            <div className="header-logo">
                <img src={logo} alt="logo" className="logo-icon" />
                <span className="logo-text">travelflow</span>
            </div>
            {!hideAvatar && <div className="header-avatar">A</div>}
        </header>
    )
}

export default Header