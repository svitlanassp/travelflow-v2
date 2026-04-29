import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Input from '../UI/Input';
import CategorySelect from '../UI/CategorySelect';
import { CATEGORY_STYLES } from '../../constants/categories';
import { api } from '../../services/api';
import './EventModal.css'; // Наш новий CSS

function EditEventModal({ isOpen, onClose, eventData, onEventUpdated, onDeleteClick }) {
    const [form, setForm] = useState({
        title: '',
        visit_date: '',
        visit_time: '',
        cost: '',
        category: 'others', // Дефолт, щоб не падало, якщо що
        notes: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (eventData) {
            setForm({
                title: eventData.title || '',
                visit_date: eventData.visit_date || eventData.displayDate || '',
                visit_time: eventData.visit_time || '',
                cost: eventData.cost || eventData.displayAmount || '',
                category: eventData.category || 'others',
                notes: eventData.notes || ''
            });
        }
    }, [eventData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            
            if (!form.title || !form.category || !form.visit_date) {
                alert("Name, category, and date are required!");
                setIsSubmitting(false);
                return;
            }

            const updatedData = {
                title: form.title,
                category: form.category,
                visit_date: form.visit_date,
                visit_time: form.visit_time || null,
                cost: form.cost ? parseFloat(form.cost) : 0,
                notes: form.notes || ''
            };

            // Оновлюємо через API
            const updatedEvent = await api.updatePlace(eventData.id, updatedData);
            onEventUpdated(updatedEvent);

        } catch (error) {
            console.error("Failed to update event", error);
            alert("Oops! Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    // Дістаємо стилі поточної категорії (якщо юзер вибрав іншу - модалка одразу перефарбується!)
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
                // МАГІЯ КОЛЬОРІВ ТУТ:
                style={{ 
                    '--theme-bg': currentStyle.bg, 
                    '--theme-main': currentStyle.main, 
                    '--theme-dark': currentStyle.dark 
                }}
            >
                {/* ШАПКА З ІНПУТОМ */}
                <div className="event-modal-header">
                    <input 
                        className="event-title-input"
                        name="title"
                        value={form.title}
                        onChange={handleInputChange}
                        placeholder="Event name..."
                        autoFocus
                    />
                    <button className="close-event-btn" onClick={onClose}>×</button>
                </div>

                {/* ТІЛО (Всі Input стануть білими завдяки CSS вище) */}
                <div className="event-modal-body">
                    <div className="input-row">
                        <Input label="date" name="visit_date" type="date" value={form.visit_date} onChange={handleInputChange} />
                        <Input label="time (optional)" name="visit_time" type="time" value={form.visit_time} onChange={handleInputChange} />
                    </div>

                    <Input label="cost (optional, $)" name="cost" type="number" placeholder="0.00" value={form.cost} onChange={handleInputChange} />

                    <CategorySelect label="category" value={form.category} onChange={(val) => setForm({ ...form, category: val })} />

                    <Input as="textarea" label="notes & links" name="notes" placeholder="tickets, links..." value={form.notes} onChange={handleInputChange} />
                </div>

                {/* ФУТЕР */}
                <div className="event-modal-footer">
                    <button 
                        className="event-delete-btn" 
                        onClick={() => {
                            onClose(); // Закриваємо модалку едіту
                            onDeleteClick(eventData); // Відкриваємо модалку підтвердження видалення
                        }}
                        title="Delete event"
                    >
                        🗑️
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