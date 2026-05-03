import { useNavigate } from 'react-router-dom';
import TripActionsMenu from '../UI/TripActionsMenu';
import CategoryFilterDropdown from '../UI/CategoryFilterDropdown';

function TripSubheader({ 
    trip, 
    activeTab, 
    setActiveTab, 
    categoryFilter, 
    setCategoryFilter, 
    onAddClick, 
    onEditTrip, 
    onDeleteTrip 
}) {
    const navigate = useNavigate();

    return (
        <div className="subheader">
            <div className="subheader-left">
                <button className="back-btn" onClick={() => navigate('/trips')}>←</button>
                
                <div className="trip-title-wrapper">
                    <h1 className="trip-title">{trip.title}</h1>
                    <TripActionsMenu 
                        variant="icon-vertical"
                        onEdit={onEditTrip} 
                        onDelete={onDeleteTrip} 
                    />
                </div>

                <div className="tabs">
                    <div className={`tab-glider ${activeTab}`}></div>
                    <button 
                        className={`tab ${activeTab === 'schedule' ? 'active' : ''}`}
                        onClick={() => setActiveTab('schedule')}
                    >schedule</button>
                    <button 
                        className={`tab ${activeTab === 'budget' ? 'active' : ''}`}
                        onClick={() => setActiveTab('budget')}
                    >budget</button>
                </div>
            </div>

            {activeTab === 'schedule' && (
                <div className="subheader-right">
                    <CategoryFilterDropdown 
                        categoryFilter={categoryFilter} 
                        setCategoryFilter={setCategoryFilter} 
                    />
                    <button className="btn-primary btn-add" onClick={onAddClick}>+</button>
                </div>
            )}
        </div>
    );
}

export default TripSubheader;