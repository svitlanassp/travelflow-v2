import { useState, useEffect } from 'react'
import Header from '../components/Header/Header'
import TripCard from '../components/TripCard/TripCard'
import Widgets from '../components/Widgets/Widgets'
import AddTripModal from '../components/AddTripModal/AddTripModal';
import { api } from '../services/api'
import { Auth } from '../services/auth'
import './TripsPage.css'

function TripsPage() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(null); 

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const data = await api.getTrips();
                setTrips(data);
            } catch (error) {
                console.error("Error fetching trips:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, []);

    const username = Auth.getUsername();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredTrips = trips.filter(trip => {
        const endDate = new Date(trip.end_date);
        let passesType = true;
        if (filter === 'active') passesType = endDate >= today;
        if (filter === 'past') passesType = endDate < today;
        
        if (!passesType) return false;

        if (selectedMonth !== null) {
            const tripStart = new Date(trip.start_date);
            tripStart.setHours(0, 0, 0, 0);
            const tripEnd = new Date(trip.end_date);
            tripEnd.setHours(0, 0, 0, 0);

            const filterMonthStart = new Date(selectedYear, selectedMonth, 1);
            const filterMonthEnd = new Date(selectedYear, selectedMonth + 1, 0);

            const overlaps = tripStart <= filterMonthEnd && tripEnd >= filterMonthStart;
            if (!overlaps) return false;
        }

        return true;
    });

    const isTotallyEmpty = trips.length === 0;
    
    const isFilteredEmpty = filteredTrips.length === 0 && !isTotallyEmpty;

    return (
        <div className="app-wrapper">
            <Header />
            <div className="page-container">
                <p className="welcome-text">welcome back, {username} ✦</p>
                
                {!isTotallyEmpty && (
                    <div className="trips-header">
                        <div className="trips-header-left">
                            <h1 className="trips-title">your trips</h1>
                            <div className="filter-pills">
                                {['all', 'active', 'past'].map(f => (
                                    <button 
                                        key={f}
                                        className={`pill ${filter === f ? 'active' : ''}`}
                                        onClick={() => setFilter(f)}
                                    >{f}</button>
                                ))}
                            </div>
                        </div>
                        <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>→ plan</button>
                    </div>
                )}

                {loading ? (
                    <div className="loading-state">fetching adventures...</div>
                ) : isTotallyEmpty ? (
                    <div className="empty-state-container full-empty-page">
                        <h2 className="empty-state-title">no trips yet</h2>
                        <p className="empty-state-text">looks like it's time to start planning your first journey</p>
                        <button className="btn-primary" style={{marginTop: '2rem'}} onClick={() => setIsAddModalOpen(true)}>→ plan trip</button>
                    </div>
                ) : (
                    <>
                        {isFilteredEmpty ? (
                            <div className="empty-state-container">
                                <h2 className="empty-state-title">no {filter} trips</h2>
                                <p className="empty-state-text">try switching filters to see your other journeys</p>
                            </div>
                        ) : (
                            <div className="trips-list">
                                {filteredTrips.map(trip => (
                                    <TripCard key={trip.id} trip={trip} />
                                ))}
                            </div>
                        )}
                        
                        <Widgets 
                            trips={trips} 
                            selectedYear={selectedYear}
                            setSelectedYear={setSelectedYear}
                            selectedMonth={selectedMonth}
                            setSelectedMonth={setSelectedMonth}
                        />
                    </>
                )}
            </div>

            <AddTripModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)}
                onTripAdded={(newTrip) => {
                    setTrips(prev => [...prev, newTrip]); // Додаємо нову подорож в стейт
                    setIsAddModalOpen(false); // Закриваємо модалку
                }}
            />

        </div>
    )
}

export default TripsPage