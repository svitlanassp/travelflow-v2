import { useState } from 'react';
import BaseModal from '../UI/BaseModal';
import Input from '../UI/Input';
import CategorySelect from '../UI/CategorySelect';
import { api } from '../../services/api';

function AddEventModal({ isOpen, onClose, tripId, minDate, maxDate, onEventAdded }) {
    const [form, setForm] = useState({
        title: '',
        visit_date: '',
        visit_time: '',
        cost: '',
        category: '',
        notes: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            
            if (!form.title || !form.category || !form.visit_date) {
                alert("Please fill in name, date, and category!");
                setIsSubmitting(false);
                return;
            }

            const eventData = {
                trip: tripId,
                title: form.title,
                category: form.category,
                visit_date: form.visit_date,
                visit_time: form.visit_time || null,
                cost: form.cost ? parseFloat(form.cost) : 0,
                notes: form.notes || ''
            };

            const newEvent = await api.createPlace(eventData);
            
            setForm({ title: '', visit_date: '', visit_time: '', cost: '', category: '', notes: '' });
            onEventAdded(newEvent);

        } catch (error) {
            console.error("Failed to add event", error);
            alert("Oops! Something went wrong.");
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
            <Input 
                label="name" 
                name="title" 
                placeholder="e.g. Colosseum Tour" 
                value={form.title} 
                onChange={handleInputChange} 
            />
            
            <div className="input-row">
                <Input 
                    label="date" 
                    name="visit_date" 
                    type="date" 
                    value={form.visit_date} 
                    onChange={handleInputChange} 
                    min={minDate}
                    max={maxDate}
                />
                <Input 
                    label="time (optional)" 
                    name="visit_time" 
                    type="time" 
                    value={form.visit_time} 
                    onChange={handleInputChange} 
                />
            </div>

            <Input 
                label="cost (optional, $)" 
                name="cost" 
                type="number" 
                placeholder="0.00" 
                value={form.cost} 
                onChange={handleInputChange} 
            />

            <CategorySelect 
                label="category" 
                value={form.category} 
                onChange={(val) => setForm({ ...form, category: val })} 
            />

            <Input 
                as="textarea"
                label="notes & links (optional)" 
                name="notes" 
                placeholder="tickets, links, or what to bring..." 
                value={form.notes} 
                onChange={handleInputChange} 
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

export default AddEventModal;