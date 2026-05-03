import { useState } from 'react';
import BaseModal from '../UI/BaseModal';
import Input from '../UI/Input';
import CategorySelect from '../UI/CategorySelect'; 
import { api } from '../../services/api';

function AddExpenseModal({ isOpen, onClose, tripId, onExpenseAdded, onError }) {
    const [form, setForm] = useState({
        title: '',
        category: '',
        date: '',
        amount: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            setErrors({});

            const todayDate = new Date().toISOString().split('T')[0];

            const expenseData = {
                trip: tripId, 
                title: form.title,
                category: form.category || 'others',
                amount: form.amount ? parseFloat(form.amount) : null,
                date: form.date || todayDate 
            };

            const newExpense = await api.createExpense(expenseData);
            
            setForm({ title: '', category: '', date: '', amount: '' });
            setErrors({});
            onExpenseAdded(newExpense);

        } catch (error) {
            if (error.response && error.response.data && error.response.status === 400) {
                const backendErrors = error.response.data;
                const formattedErrors = {};
                for (const key in backendErrors) {
                    formattedErrors[key] = Array.isArray(backendErrors[key]) 
                        ? backendErrors[key][0] 
                        : backendErrors[key];
                }
                setErrors(formattedErrors); 
            } else {
                if (onError) onError("Oops! Could not add expense. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <BaseModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="add expense"
        >
            <Input 
                label="name" 
                name="title" 
                placeholder="e.g. Morning Coffee" 
                value={form.title} 
                onChange={handleInputChange} 
                error={errors.title}
            />
            
            <div className="input-row">
                <Input 
                    label="date (optional)" 
                    name="date" 
                    type="date" 
                    value={form.date} 
                    onChange={handleInputChange} 
                    error={errors.date}
                />
                <Input 
                    label="cost ($)" 
                    name="amount" 
                    type="number" 
                    placeholder="0.00" 
                    value={form.amount} 
                    onChange={handleInputChange} 
                    error={errors.amount}
                />
            </div>

            <CategorySelect 
                label="category" 
                value={form.category} 
                onChange={(val) => {
                    setForm({ ...form, category: val });
                    if (errors.category) setErrors(prev => ({ ...prev, category: null }));
                }}
            />

            <div className="modal-footer">
                <button className="btn-secondary" onClick={onClose}>cancel</button>
                <button 
                    className="btn-primary modal-btn"
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'saving...' : '→ add'}
                </button>
            </div>
        </BaseModal>
    );
}

export default AddExpenseModal;