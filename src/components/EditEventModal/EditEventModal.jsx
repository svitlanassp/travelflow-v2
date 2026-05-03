import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Input from '../UI/Input';
import DeleteIcon from '../../icons/delete.svg?react';
import CategorySelect from '../UI/CategorySelect';
import { CATEGORY_STYLES } from '../../constants/categories';
import { api } from '../../services/api';
import './EventModal.css'; 

function EditEventModal({ isOpen, onClose, eventData, minDate, maxDate, onEventUpdated, onDeleteClick, onError }) {
    const [form, setForm] = useState({
        title: '',
        visit_date: '',
        visit_time: '',
        cost: '',
        category: 'others',
        notes: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (eventData) {
            setForm({
                title: eventData.title || '',
                visit_date: eventData.visit_date || '',
                visit_time: eventData.visit_time || '',
                cost: eventData.cost || '',
                category: eventData.category || 'others',
                notes: eventData.notes || ''
            });
            setErrors({}); 
        }
    }, [eventData]);

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
            
            const updatedData = {
                title: form.title,
                category: form.category || 'others',
                visit_date: form.visit_date || null,
                visit_time: form.visit_time || null,
                cost: form.cost ? parseFloat(form.cost) : 0,
                notes: form.notes || ''
            };

            const updatedEvent = await api.updatePlace(eventData.id, updatedData);
            onEventUpdated(updatedEvent);

        } catch (error) {
            console.error("Failed to update event", error);
            
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
                if (onError) onError("Oops! Could not update the event.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const currentStyle = CATEGORY_STYLES[form.category] || CATEGORY_STYLES['others'];

    return (
        <motion.div 
            className="event-modal-overlay" 
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div 
                layoutId={`event-card-${eventData?.id}`}
                className="event-modal-card" 
                onClick={e => e.stopPropagation()}
                style={{ 
                    '--theme-bg': currentStyle.bg, 
                    '--theme-main': currentStyle.main, 
                    '--theme-dark': currentStyle.dark 
                }}
            >
                <div className="event-modal-header" style={{ flexDirection: 'column', alignItems: 'flex-start', position: 'relative' }}>
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                        <input 
                            className={`event-title-input ${errors.title ? 'input-error' : ''}`}
                            name="title"
                            value={form.title}
                            onChange={handleInputChange}
                            placeholder="Event name..."
                            autoFocus
                            style={errors.title ? { color: 'var(--red-main)' } : {}}
                        />
                        <button className="close-event-btn" onClick={onClose}>×</button>
                    </div>
                    {errors.title && <span className="input-error-text" style={{ marginTop: '4px', marginLeft: '12px' }}>{errors.title}</span>}
                </div>

                <div className="event-modal-body">
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
                        as="textarea" label="notes & links" name="notes" 
                        placeholder="tickets, links..." value={form.notes} onChange={handleInputChange} 
                        error={errors.notes}
                    />
                </div>

                <div className="event-modal-footer">
                    <button 
                        className="event-delete-btn" 
                        onClick={() => {
                            onClose(); 
                            onDeleteClick(eventData); 
                        }}
                        title="Delete event"
                    >
                        <span className="icon">
                            <DeleteIcon />
                        </span>
                    </button>
                    
                    <button 
                        className="event-save-btn" 
                        onClick={handleSubmit} 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'saving...' : 'save changes'}
                    </button>
                </div>

            </motion.div>
        </motion.div>
    );
}

export default EditEventModal;