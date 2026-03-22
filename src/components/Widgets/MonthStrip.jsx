const MONTHS = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']

function MonthStrip() {
    return (
        <div className="widget-card month-widget">
            <p className="widget-year">{'< 2026 >'}</p>
            <div className="months-row">
                {MONTHS.map((month, i) => (
                    <div key={month} className={`month-pill ${[4,6,7].includes(i) ? 'active' : ''}`}>
                        <div className="month-bar" />
                        <span className="month-label">{month}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MonthStrip