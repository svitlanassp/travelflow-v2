import './TripCard.css'

// Адреса твого бекенду
const BACKEND_URL = 'http://127.0.0.1:8000';

function TripCard({ trip }) {
    const progress = trip.total_budget > 0 
        ? Math.min((trip.total_spent / trip.total_budget) * 100, 100)
        : 0;

    const formatDateRange = (startStr, endStr) => {
        const start = new Date(startStr);
        const end = new Date(endStr);
        
        const monthDayOptions = { month: 'long', day: 'numeric' };
        const yearOptions = { year: 'numeric' };

        const formattedStart = new Intl.DateTimeFormat('en-US', monthDayOptions).format(start);
        const formattedEnd = new Intl.DateTimeFormat('en-US', monthDayOptions).format(end);
        const formattedYear = new Intl.DateTimeFormat('en-US', yearOptions).format(end);

        return `${formattedStart.toLowerCase()} - ${formattedEnd.toLowerCase()}, ${formattedYear}`;
    };

    // Функція для правильного формування URL картинки
    const getImageUrl = (path) => {
        if (!path) return null;
        // Якщо бекенд раптом почне повертати абсолютний URL (з http)
        if (path.startsWith('http')) return path;
        // Інакше клеїмо домен бекенду до відносного шляху
        return `${BACKEND_URL}${path}`;
    };

    const imageUrl = getImageUrl(trip.cover_image);

    return (
        <div className="trip-card">
            <div className="trip-card-image" style={{ backgroundColor: '#F0F0F0' }}>
                {/* Використовуємо наш згенерований imageUrl */}
                {imageUrl && (
                    <img src={imageUrl} alt={trip.title} />
                )}
            </div>
            <div className="trip-card-content">
                <h2 className="trip-card-title">{trip.title}</h2>
                <p className="trip-card-location">{trip.city}, {trip.country}</p>
                <p className="trip-card-dates">
                    {formatDateRange(trip.start_date, trip.end_date)}
                </p>
                <div className="trip-progress-bar">
                    <div className="trip-progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <p className="trip-card-budget">${trip.total_spent} / ${trip.total_budget}</p>
            </div>
        </div>
    )
}

export default TripCard