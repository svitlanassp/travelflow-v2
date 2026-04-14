import NextTripWidget from './NextTripWidget'
import MonthStrip from './MonthStrip'
import './Widgets.css'

function Widgets({ trips, selectedYear, setSelectedYear, selectedMonth, setSelectedMonth }) {
    return (
        <div className="widgets-row">
            <NextTripWidget trips={trips} />
            <MonthStrip 
                trips={trips}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
            />
        </div>
    )
}

export default Widgets