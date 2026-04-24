// src/components/UI/Input.jsx
import './Input.css'

function Input({ label, as: Component = 'input', ...props }) {
    return (
        <div className="input-group">
            {label && <label className="input-label">{label}</label>}
            <Component className="input-field" {...props} />
        </div>
    )
}

export default Input