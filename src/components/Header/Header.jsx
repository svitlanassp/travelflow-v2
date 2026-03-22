import logo from '../../assets/logo.png'

function Header() {
    return (
        <div>
            <header className="header-card">
                <div className="header-logo">
                    <img src={logo} alt="logo" className="logo-icon" />
                    <span className="logo-text">travelflow</span>
                </div>
                <div className="header-avatar">A</div>
            </header>
        </div>
    )
}
export default Header