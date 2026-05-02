import { useState } from 'react';
import BaseModal from '../UI/BaseModal';
import Input from '../UI/Input';
import CategorySelect from '../UI/CategorySelect';
import { api } from '../../services/api';

// ДОДАЛИ onError
function AddEventModal({ isOpen, onClose, tripId, minDate, maxDate, onEventAdded, onError }) {
    const [form, setForm] = useState({
        title: '',
        visit_date: '',
        visit_time: '',
        cost: '',
        category: '',
        notes: ''
    });
    
    // ДОДАЛИ СТЕЙТ ПОМИЛОК
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        
        // Очищаємо помилку при вводі
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            setErrors({}); // Очищаємо старі помилки
            
            // ПРИБРАЛИ СТАРИЙ ALERT, ДОВІРЯЄМО БЕКЕНДУ

            const eventData = {
                trip: tripId,
                title: form.title,
                category: form.category || 'others',
                visit_date: form.visit_date || null,
                visit_time: form.visit_time || null,
                cost: form.cost ? parseFloat(form.cost) : 0,
                notes: form.notes || ''
            };

            const newEvent = await api.createPlace(eventData);
            
            setForm({ title: '', visit_date: '', visit_time: '', cost: '', category: '', notes: '' });
            onEventAdded(newEvent);

        } catch (error) {
            console.error("Failed to add event", error);
            
            // ЛОВИМО 400 ТА 500 ПОМИЛКИ
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
                if (onError) onError("Oops! Could not add the event.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <BaseModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="add event"
        >
            {/* ПРОКИДАЄМО ПОМИЛКИ В ІНПУТИ */}
            <Input 
                label="name" name="title" placeholder="e.g. Colosseum Tour" 
                value={form.title} onChange={handleInputChange} 
                error={errors.title}
            />
            
            <div className="input-row">
                <Input 
                    label="date" name="visit_date" type="date" 
                    value={form.visit_date} onChange={handleInputChange} 
                    min={minDate} max={maxDate} 
                    error={errors.visit_date}
                />
                <Input 
                    label="time (optional)" name="visit_time" type="time" 
                    value={form.visit_time} onChange={handleInputChange} 
                    error={errors.visit_time}
                />
            </div>

            <Input 
                label="cost (optional, $)" name="cost" type="number" 
                placeholder="0.00" value={form.cost} onChange={handleInputChange} 
                error={errors.cost}
            />

            <CategorySelect 
                label="category" value={form.category} 
                onChange={(val) => {
                    setForm({ ...form, category: val });
                    if (errors.category) setErrors(prev => ({ ...prev, category: null }));
                }} 
            />

            <Input 
                as="textarea" label="notes & links (optional)" name="notes" 
                placeholder="tickets, links, or what to bring..." 
                value={form.notes} onChange={handleInputChange} 
                error={errors.notes}
            />

            <div className="modal-footer">
                <button className="btn-secondary" onClick={onClose}>cancel</button>
                <button 
                    className="btn-primary modal-btn" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'saving...' : '→ add'}
                </button>
            </div>
        </BaseModal>
    );
}

export default AddEventModal;