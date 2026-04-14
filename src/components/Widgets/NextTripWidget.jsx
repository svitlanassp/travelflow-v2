function NextTripWidget({ trips }) {
    // Якщо масив не прийшов або порожній (про всяк випадок перевірка)
    if (!trips || trips.length === 0) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Ділимо поїздки
    const activeTrips = trips.filter(t => new Date(t.end_date) >= today);
    const pastTrips = trips.filter(t => new Date(t.end_date) < today);

    let targetTrip = null;
    let isNext = true;

    if (activeTrips.length > 0) {
        // Сортуємо активні: найближчі за датою ПОЧАТКУ будуть першими
        activeTrips.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        targetTrip = activeTrips[0];
    } else if (pastTrips.length > 0) {
        // Сортуємо минулі: найближчі за датою КІНЦЯ (найсвіжіші) будуть першими
        pastTrips.sort((a, b) => new Date(b.end_date) - new Date(a.end_date));
        targetTrip = pastTrips[0];
        isNext = false;
    }

    if (!targetTrip) return null;

    // Рахуємо різницю в днях
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    let daysDiff = 0;

    if (isNext) {
        // Якщо подорож в майбутньому (або вже почалася), рахуємо дні до старту. 
        // Math.max(0, ...) щоб не показувало мінусові дні, якщо ми ВЖЕ в подорожі
        const start = new Date(targetTrip.start_date);
        start.setHours(0, 0, 0, 0);
        daysDiff = Math.max(0, Math.round((start - today) / MS_PER_DAY));
    } else {
        // Якщо подорож в минулому, рахуємо дні від її кінця
        const end = new Date(targetTrip.end_date);
        end.setHours(0, 0, 0, 0);
        daysDiff = Math.max(0, Math.round((today - end) / MS_PER_DAY));
    }

    // Форматуємо дати (щоб було як may 8 - may 16, 2026)
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