const MONTHS = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']

function MonthStrip({ trips, selectedYear, setSelectedYear, selectedMonth, setSelectedMonth }) {

    const checkHasTrips = (monthIndex) => {
        if (!trips || trips.length === 0) return false;
        
        const filterStart = new Date(selectedYear, monthIndex, 1);
        const filterEnd = new Date(selectedYear, monthIndex + 1, 0);

        return trips.some(trip => {
            const start = new Date(trip.start_date);
            const end = new Date(trip.end_date);
            return start <= filterEnd && end >= filterStart;
        });
    };

    const handleMonthClick = (index, hasTrips) => {
        if (!hasTrips) return; 
        setSelectedMonth(prev => prev === index ? null : index);
    };

    const handlePrevYear = () => {
        setSelectedYear(y => y - 1);
        setSelectedMonth(null); 
    };
    
    const handleNextYear = () => {
        setSelectedYear(y => y + 1);
        setSelectedMonth(null);
    };

    return (
        <div className="widget-card month-widget">
            <div className="widget-year widget-year-controls">
                <span onClick={handlePrevYear}>{'<'}</span>
                <span>{selectedYear}</span>
                <span onClick={handleNextYear}>{'>'}</span>
            </div>
            
            <div className="months-row">
                {MONTHS.map((month, i) => {
                    const hasTrips = checkHasTrips(i);
                    const isSelected = selectedMonth === i;
                    const isDimmed = selectedMonth !== null && !isSelected;

                    const pillClasses = `month-pill ${hasTrips ? 'active' : 'empty'} ${isSelected ? 'selected' : ''} ${isDimmed ? 'dimmed' : ''}`;

                    return (
                        <div 
                            key={month} 
                            className={pillClasses.trim()}
                            onClick={() => handleMonthClick(i, hasTrips)}
                        >
                            <div className="month-bar" />
                            <span className="month-label">
                                {month}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default MonthStrip