function NextTripWidget({ trips }) {
    if (!trips || trips.length === 0) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeTrips = trips.filter(t => new Date(t.end_date) >= today);
    const pastTrips = trips.filter(t => new Date(t.end_date) < today);

    let targetTrip = null;
    let isNext = true;

    if (activeTrips.length > 0) {
        activeTrips.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        targetTrip = activeTrips[0];
    } else if (pastTrips.length > 0) {
        pastTrips.sort((a, b) => new Date(b.end_date) - new Date(a.end_date));
        targetTrip = pastTrips[0];
        isNext = false;
    }

    if (!targetTrip) return null;

    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    let daysDiff = 0;

    if (isNext) {
        const start = new Date(targetTrip.start_date);
        start.setHours(0, 0, 0, 0);
        daysDiff = Math.max(0, Math.round((start - today) / MS_PER_DAY));
    } else {
        const end = new Date(targetTrip.end_date);
        end.setHours(0, 0, 0, 0);
        daysDiff = Math.max(0, Math.round((today - end) / MS_PER_DAY));
    }

    const formatDateStr = (startStr, endStr) => {
        const start = new Date(startStr);
        const end = new Date(endStr);
        
        const monthDay = { month: 'long', day: 'numeric' };
        const year = { year: 'numeric' };

        const startFormatted = new Intl.DateTimeFormat('en-US', monthDay).format(start);
        const endFormatted = new Intl.DateTimeFormat('en-US', monthDay).format(end);
        const yearFormatted = new Intl.DateTimeFormat('en-US', year).format(end);

        return `${startFormatted.toLowerCase()} - ${endFormatted.toLowerCase()}, ${yearFormatted}`;
    };

    return (
        <div className="widget-card next-trip-widget">
            <p className="widget-label">{isNext ? 'next trip is:' : 'last trip was:'}</p>
            <h2 className="widget-trip-name">{targetTrip.city}, {targetTrip.country}</h2>
            <p className="widget-dates">{formatDateStr(targetTrip.start_date, targetTrip.end_date)}</p>
            <div className="widget-days-badge">
                <span className="widget-days-number">{daysDiff}</span>
                <span className="widget-days-text">{isNext ? 'days left' : 'days ago'}</span>
            </div>
        </div>
    )
}

export default NextTripWidget