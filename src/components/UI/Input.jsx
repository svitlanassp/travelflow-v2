import './Input.css'

function Input({ label, as: Component = 'input', error, ...props }) {
    return (
        <div className="input-group">
            {label && <label className="input-label">{label}</label>}
            
            <Component 
                className={`input-field ${error ? 'input-error' : ''}`} 
                {...props} 
            />
            
            {error && <span className="input-error-text">{error}</span>}
        </div>
    )
}

export default Input