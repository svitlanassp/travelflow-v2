import NextTripWidget from './NextTripWidget'
import MonthStrip from './MonthStrip'
import './Widgets.css'

function Widgets({ trips }) {
    return (
        <div className="widgets-row">
            <NextTripWidget trips={trips} />
            <MonthStrip />
        </div>
    )
}

export default Widgets