import './Input.css'

function Input({ label, as: Component = 'input', error, ...props }) {
    return (
        <div className="input-group">
            {label && <label className="input-label">{label}</label>}
            
            {/* Додаємо клас .input-error, якщо є пропс error */}
            <Component 
                className={`input-field ${error ? 'input-error' : ''}`} 
                {...props} 
            />
            
            {/* Показуємо текст помилки, якщо він є */}
            {error && <span className="input-error-text">{error}</span>}
        </div>
    )
}

export default Input