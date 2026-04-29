import { useState } from 'react';
import BaseModal from '../UI/BaseModal';
import Input from '../UI/Input';
import CategorySelect from '../UI/CategorySelect'; 
import { api } from '../../services/api';

function AddExpenseModal({ isOpen, onClose, tripId, onExpenseAdded }) {
    const [form, setForm] = useState({
        title: '',
        category: '',
        date: '',
        amount: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            
            if (!form.title || !form.category || !form.amount) {
                alert("Please fill in name, category, and cost!");
                setIsSubmitting(false);
                return;
            }

            const expenseData = {
                trip: tripId, 
                title: form.title,
                category: form.category,
                amount: parseFloat(form.amount),
                date: form.date || null 
            };

            const newExpense = await api.createExpense(expenseData);
            
            setForm({ title: '', category: '', date: '', amount: '' });
            onExpenseAdded(newExpense);

        } catch (error) {
            console.error("Failed to add expense", error);
            alert("Oops! Something went wrong.");
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
            />
            
            <div className="input-row">
                <Input 
                    label="date (optional)" 
                    name="date" 
                    type="date" 
                    value={form.date} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="cost ($)" 
                    name="amount" 
                    type="number" 
                    placeholder="0.00" 
                    value={form.amount} 
                    onChange={handleInputChange} 
                />
            </div>

            <CategorySelect 
                label="category" 
                value={form.category} 
                onChange={(val) => setForm({ ...form, category: val })} 
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