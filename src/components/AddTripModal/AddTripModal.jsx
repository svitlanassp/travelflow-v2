import { useState, useRef } from 'react';
import BaseModal from '../UI/BaseModal';
import Input from '../UI/Input';
import { api } from '../../services/api';

function AddTripModal({ isOpen, onClose, onTripAdded }) {
    const [tripForm, setTripForm] = useState({
        title: '',
        country: '',
        city: '',
        start_date: '',
        end_date: '',
        total_budget: ''
    });

    const [coverFile, setCoverFile] = useState(null);
    const fileInputRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTripForm(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateTrip = async () => {
        try {
            setIsSubmitting(true);
            
            const formData = new FormData();
            formData.append('title', tripForm.title);
            formData.append('country', tripForm.country);
            formData.append('city', tripForm.city);
            formData.append('start_date', tripForm.start_date);
            formData.append('end_date', tripForm.end_date);
            
            if (tripForm.total_budget) {
                formData.append('total_budget', tripForm.total_budget);
            }
            if (coverFile) {
                formData.append('cover_image', coverFile);
            }

            const newTrip = await api.createTrip(formData);
            
            // Чистимо форму
            setTripForm({ title: '', country: '', city: '', start_date: '', end_date: '', total_budget: '' });
            setCoverFile(null);
            
            // Кажемо батьку, що все ок
            onTripAdded(newTrip);

        } catch (error) {
            console.error("Failed to create trip:", error);
            alert("Oops! Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <BaseModal 
            isOpen={isOpen} 
            onClose={onClose}
            title="plan your trip"
        >
            <Input 
                label="title" 
                name="title"
                placeholder="your adventure title" 
                value={tripForm.title}
                onChange={handleInputChange}
            />
            
            <div className="input-row">
                <Input 
                    label="country" 
                    name="country"
                    placeholder="e.g. Italy" 
                    value={tripForm.country}
                    onChange={handleInputChange}
                />
                <Input 
                    label="city" 
                    name="city"
                    placeholder="e.g. Rome" 
                    value={tripForm.city}
                    onChange={handleInputChange}
                />
            </div>

            <div className="input-row">
                <Input 
                    label="start date" 
                    name="start_date"
                    type="date" 
                    value={tripForm.start_date}
                    onChange={handleInputChange}
                />
                <Input 
                    label="end date" 
                    name="end_date"
                    type="date" 
                    value={tripForm.end_date}
                    onChange={handleInputChange}
                />
            </div>

            <Input 
                label="budget ($)" 
                name="total_budget"
                type="number" 
                placeholder="0.00" 
                value={tripForm.total_budget}
                onChange={handleInputChange}
            />

            <input 
                type="file" 
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => setCoverFile(e.target.files[0])}
            />
            <button 
                className="upload-photo-btn"
                onClick={() => fileInputRef.current.click()}
            >
                <span>📷</span> 
                {coverFile ? coverFile.name : 'upload cover photo'}
            </button>

            <div className="modal-footer">
                <button className="btn-secondary" onClick={onClose}>cancel</button>
                <button 
                    className="btn-primary" 
                    onClick={handleCreateTrip}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'saving...' : '→ go'}
                </button>
            </div>
        </BaseModal>
    );
}

export default AddTripModal;