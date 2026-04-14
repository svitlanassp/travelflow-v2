import { useState, useEffect } from 'react'
import Header from '../components/Header/Header'
import TripCard from '../components/TripCard/TripCard'
import Widgets from '../components/Widgets/Widgets'
import { api } from '../services/api'
import './TripsPage.css'

function TripsPage() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredTrips = trips.filter(trip => {
        if (filter === 'all') return true;
        const endDate = new Date(trip.end_date);
        return filter === 'active' ? endDate >= today : endDate < today;
    });

    // 1. Стейт повного відсутності поїздок
    const isTotallyEmpty = trips.length === 0;
    
    // 2. Стейт відсутності результатів фільтрації
    const isFilteredEmpty = filteredTrips.length === 0 && !isTotallyEmpty;

    return (
        <div className="app-wrapper">
            <Header />
            <div className="page-container">
                <p className="welcome-text">welcome back, Arisu ✦</p>
                
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
                        <button className="btn-primary">→ plan</button>
                    </div>
                )}

                {loading ? (
                    <div className="loading-state">fetching adventures...</div>
                ) : isTotallyEmpty ? (
                    /* Кейс: Поїздок 0 взагалі — ховаємо все */
                    <div className="empty-state-container full-empty-page">
                        <h2 className="empty-state-title">no trips yet</h2>
                        <p className="empty-state-text">looks like it's time to start planning your first journey.</p>
                        <button className="btn-primary" style={{marginTop: '2rem'}}>→ plan trip</button>
                    </div>
                ) : (
                    <>
                        {isFilteredEmpty ? (
                            /* Кейс: Фільтр порожній, але поїздки існують — фільтри лишаються */
                            <div className="empty-state-container">
                                <h2 className="empty-state-title">no {filter} trips</h2>
                                <p className="empty-state-text">try switching filters to see your other journeys.</p>
                            </div>
                        ) : (
                            <div className="trips-list">
                                {filteredTrips.map(trip => (
                                    <TripCard key={trip.id} trip={trip} />
                                ))}
                            </div>
                        )}
                        
                        {/* Віджети показуємо тільки якщо є хоча б одна поїздка в базі */}
                        <Widgets trips={trips} />
                    </>
                )}
            </div>
        </div>
    )
}

export default TripsPage