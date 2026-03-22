function NextTripWidget() {
    const nextTrip = {
        name: 'Paris, France',
        start: 'may 8, 2026',
        end: 'may 16, 2026',
        daysLeft: 70
    }

    return (
        <div className="widget-card next-trip-widget">
            <p className="widget-label">next trip is:</p>
            <h2 className="widget-trip-name">{nextTrip.name}</h2>
            <p className="widget-dates">{nextTrip.start} - {nextTrip.end}</p>
            <div className="widget-days-badge">
                <span className="widget-days-number">{nextTrip.daysLeft}</span>
                <span className="widget-days-text">days left</span>
            </div>
        </div>
    )
}

export default NextTripWidget