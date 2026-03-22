function Widgets() {
    const nextTrip = {
        name: 'Paris, France',
        start: 'may 8, 2026',
        end: 'may 16, 2026',
        daysLeft: 70
    }

    return (
        <div className="widgets-row">
            <div className="widget-card next-trip-widget">
                <p className="widget-label">next trip is:</p>
                <h2 className="widget-trip-name">{nextTrip.name}</h2>
                <p className="widget-dates">{nextTrip.start} - {nextTrip.end}</p>
                <div className="widget-days-badge">
                    <span className="widget-days-number">{nextTrip.daysLeft}</span>
                    <span className="widget-days-text">days left</span>
                </div>
            </div>

            <div className="widget-card month-widget">
                <p className="widget-year">{'< 2026 >'}</p>
                <div className="months-row">
                    {['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].map((month, i) => (
                        <div key={month} className={`month-pill ${[4,6,7].includes(i) ? 'active' : ''}`}>
                            <div className="month-bar" />
                            <span className="month-label">{month}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Widgets
