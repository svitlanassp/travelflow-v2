import NextTripWidget from './NextTripWidget'
import MonthStrip from './MonthStrip'
import './Widgets.css'

function Widgets() {
    return (
        <div className="widgets-row">
            <NextTripWidget />
            <MonthStrip />
        </div>
    )
}

export default Widgets