import Header from '../components/Header/Header'
import TripCard from '../components/TripCard/TripCard'
import Widgets from '../components/Widgets/Widgets'

const mockTrips = [
    { id: 1, title: 'birthday trip', city: 'Paris', country: 'France', start_date: 'may 8', end_date: 'may 16, 2026', total_spent: 100, total_budget: 500, color: '#C8C0F0' },
    { id: 2, title: 'Trip to Paris', city: 'Paris', country: 'France', start_date: 'may 8', end_date: 'may 16, 2026', total_spent: 100, total_budget: 500, color: '#F4B8C1' },
    { id: 3, title: 'Portugal summer', city: 'Lisbon', country: 'Portugal', start_date: 'june 8', end_date: 'june 16, 2026', total_spent: 100, total_budget: 500, color: '#F0D4A8' },
    { id: 4, title: 'Trip to Paris', city: 'Paris', country: 'France', start_date: 'may 8', end_date: 'may 16, 2026', total_spent: 100, total_budget: 500, color: '#A8D8E8' },
]

function TripsPage() {
    return (
        <div className="app-wrapper">
            <Header />
            <div className="page-container">
                <p className="welcome-text">welcome back, Arisu ✦</p>
                <div className="trips-header">
                    <div className="trips-header-left">
                        <h1 className="trips-title">your trips</h1>
                        <div className="filter-pills">
                            <button className="pill active">all</button>
                            <button className="pill">active</button>
                            <button className="pill">past</button>
                        </div>
                    </div>
                    <button className="btn-plan">→ plan</button>
                </div>
                <div className="trips-list">
                    {mockTrips.map(trip => (
                        <TripCard key={trip.id} trip={trip} />
                    ))}
                </div>
                <Widgets />
            </div>
        </div>
    )
}

export default TripsPage