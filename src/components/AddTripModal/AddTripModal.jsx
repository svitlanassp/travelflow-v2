import { useState, useRef } from 'react';
import BaseModal from '../UI/BaseModal';
import Input from '../UI/Input';
import EmojiPicker from 'emoji-picker-react'; 
import { api } from '../../services/api';
import './AddTripModal.css'; 

const COVER_COLORS = [
    '#D9D2E9', 
    '#F4CCCC', 
    '#FCE5CD', 
    '#FFF2CC', 
    '#D0E0E3', 
    '#CFE2F3',
    '#D9EAD3', 
    '#EAD1DC'  
];

function AddTripModal({ isOpen, onClose, onTripAdded, onError }) {
    const [tripForm, setTripForm] = useState({
        title: '',
        country: '',
        city: '',
        start_date: '',
        end_date: '',
        total_budget: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [coverType, setCoverType] = useState('photo'); 
    const [coverFile, setCoverFile] = useState(null);
    const fileInputRef = useRef(null);
    
    const [coverColor, setCoverColor] = useState(COVER_COLORS[0]); 
    const [coverEmoji, setCoverEmoji] = useState('✈️'); 
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTripForm(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleCreateTrip = async () => {
        try {
            setIsSubmitting(true);
            setErrors({});
            
            const formData = new FormData();
            formData.append('title', tripForm.title);
            formData.append('country', tripForm.country);
            formData.append('city', tripForm.city);
            formData.append('start_date', tripForm.start_date);
            formData.append('end_date', tripForm.end_date);
            
            if (tripForm.total_budget) {
                formData.append('total_budget', tripForm.total_budget);
            }

            if (coverType === 'photo' && coverFile) {
                formData.append('cover_image', coverFile);
            } else if (coverType === 'color') {
                formData.append('cover_color', coverColor);
                formData.append('cover_emoji', coverEmoji);
            }

            const newTrip = await api.createTrip(formData);
            
            setTripForm({ title: '', country: '', city: '', start_date: '', end_date: '', total_budget: '' });
            setCoverFile(null);
            setCoverType('photo');
            setCoverColor(COVER_COLORS[0]);
            setCoverEmoji('✈️');
            
            onTripAdded(newTrip);

        } catch (error) {
            console.error("Failed to create trip:", error);
            
            if (error.response && error.response.data && error.response.status === 400) {
                const backendErrors = error.response.data;
                const formattedErrors = {};
                for (const key in backendErrors) {
                    formattedErrors[key] = Array.isArray(backendErrors[key]) 
                        ? backendErrors[key][0] : backendErrors[key];
                }
                setErrors(formattedErrors); 
            } else {
                onError("Failed to create the trip. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="plan your trip">
            <Input label="title" name="title" placeholder="your adventure title" value={tripForm.title} onChange={handleInputChange} error={errors.title} />
            
            <div className="input-row">
                <Input label="country" name="country" placeholder="e.g. Italy" value={tripForm.country} onChange={handleInputChange} error={errors.country} />
                <Input label="city" name="city" placeholder="e.g. Rome" value={tripForm.city} onChange={handleInputChange} error={errors.city} />
            </div>

            <div className="input-row">
                <Input label="start date" name="start_date" type="date" value={tripForm.start_date} onChange={handleInputChange} error={errors.start_date} />
                <Input label="end date" name="end_date" type="date" value={tripForm.end_date} onChange={handleInputChange} error={errors.end_date} />
            </div>

            <Input label="budget ($)" name="total_budget" type="number" placeholder="0.00" value={tripForm.total_budget} onChange={handleInputChange} error={errors.total_budget} />

            <div className="cover-selector-container">
                <div className="cover-tabs">
                    <div className={`cover-tab-glider ${coverType}`} />
                    
                    <button 
                        type="button" 
                        className={`cover-tab ${coverType === 'photo' ? 'active' : ''}`} 
                        onClick={() => setCoverType('photo')}
                    >
                        🖼️ Photo
                    </button>
                    <button 
                        type="button" 
                        className={`cover-tab ${coverType === 'color' ? 'active' : ''}`} 
                        onClick={() => setCoverType('color')}
                    >
                        🎨 Color & Emoji
                    </button>
                </div>

                {coverType === 'photo' ? (
                    <>
                        <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={(e) => setCoverFile(e.target.files[0])} />
                        <button className="upload-photo-btn" onClick={() => fileInputRef.current.click()}>
                            <span>📷</span> {coverFile ? coverFile.name : 'upload cover photo'}
                        </button>
                    </>
                ) : (
                    <div className="color-emoji-wrapper">
                        <div className="color-swatches">
                            {COVER_COLORS.map(color => (
                                <button 
                                    key={color} type="button" 
                                    className={`color-swatch ${coverColor === color ? 'selected' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setCoverColor(color)}
                                    title="Choose color"
                                />
                            ))}
                        </div>
                        
                        <div className="emoji-selector">
                            <button 
                                type="button" className="emoji-btn" 
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                title="Choose emoji"
                            >
                                {coverEmoji}
                            </button>
                            
                            {showEmojiPicker && (
                                <div className="emoji-picker-popup">
                                    <EmojiPicker 
                                        onEmojiClick={(emojiData) => {
                                            setCoverEmoji(emojiData.emoji);
                                            setShowEmojiPicker(false);
                                        }}
                                        width={280}
                                        height={350}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="modal-footer" style={{ marginTop: '24px' }}>
                <button className="btn-secondary" onClick={onClose}>cancel</button>
                <button className="btn-primary modal-btn" onClick={handleCreateTrip} disabled={isSubmitting}>
                    {isSubmitting ? 'saving...' : '→ go'}
                </button>
            </div>
        </BaseModal>
    );
}

export default AddTripModal;