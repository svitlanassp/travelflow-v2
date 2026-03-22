function TripCard({ trip }) {
    return (
        <div className="trip-card">
            <div className="trip-card-image" style={{ backgroundColor: trip.color || '#AFA9EC' }}>
                {trip.cover_image 
                    ? <img src={trip.cover_image} alt={trip.title} />
                    : <span className="trip-emoji">{trip.emoji || '✈️'}</span>
                }
            </div>
            <div className="trip-card-content">
                <h2 className="trip-card-title">{trip.title}</h2>
                <p className="trip-card-location">{trip.city}, {trip.country}</p>
                <p className="trip-card-dates">{trip.start_date} - {trip.end_date}</p>
                <div className="trip-progress-bar">
                    <div 
                        className="trip-progress-fill"
                        style={{ width: `${Math.min((trip.total_spent / trip.total_budget) * 100, 100)}%` }}
                    />
                </div>
                <p className="trip-card-budget">${trip.total_spent} / ${trip.total_budget}</p>
            </div>
        </div>
    )
}

export default TripCard