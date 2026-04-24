import './Input.css'

// Використовуємо ...props, щоб автоматично ловити name, value, onChange та інше
function Input({ label, ...props }) {
    return (
        <div className="input-group">
            {label && <label className="input-label">{label}</label>}
            <input
                className="input-field"
                {...props} 
            />
        </div>
    )
}

export default Input