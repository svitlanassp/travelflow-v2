import { render, screen, fireEvent } from '@testing-library/react';
import NextTripWidget from '../components/Widgets/NextTripWidget';
import MonthStrip from '../components/Widgets/MonthStrip';

// ─── NextTripWidget ──────────────────────────────────────────────────────────
describe('NextTripWidget', () => {
    test('renders nothing when trips is empty', () => {
        const { container } = render(<NextTripWidget trips={[]} />);
        expect(container.firstChild).toBeNull();
    });

    test('renders nothing when trips is null', () => {
        const { container } = render(<NextTripWidget trips={null} />);
        expect(container.firstChild).toBeNull();
    });

    test('shows "next trip is:" for future trip', () => {
        const future = new Date();
        future.setDate(future.getDate() + 10);
        const end = new Date(future);
        end.setDate(end.getDate() + 5);

        const trips = [{
            id: 1,
            city: 'Paris',
            country: 'France',
            start_date: future.toISOString().split('T')[0],
            end_date: end.toISOString().split('T')[0]
        }];

        render(<NextTripWidget trips={trips} />);
        expect(screen.getByText('next trip is:')).toBeInTheDocument();
        expect(screen.getByText('Paris, France')).toBeInTheDocument();
    });

    test('shows "last trip was:" for past trip', () => {
        const trips = [{
            id: 1,
            city: 'Rome',
            country: 'Italy',
            start_date: '2020-01-01',
            end_date: '2020-01-10'
        }];

        render(<NextTripWidget trips={trips} />);
        expect(screen.getByText('last trip was:')).toBeInTheDocument();
        expect(screen.getByText('Rome, Italy')).toBeInTheDocument();
    });

    test('shows "days left" for future trip', () => {
        const future = new Date();
        future.setDate(future.getDate() + 5);
        const end = new Date(future);
        end.setDate(end.getDate() + 3);

        const trips = [{
            id: 1,
            city: 'London',
            country: 'UK',
            start_date: future.toISOString().split('T')[0],
            end_date: end.toISOString().split('T')[0]
        }];

        render(<NextTripWidget trips={trips} />);
        expect(screen.getByText('days left')).toBeInTheDocument();
    });

    test('shows "days ago" for past trip', () => {
        const trips = [{
            id: 1,
            city: 'Berlin',
            country: 'Germany',
            start_date: '2020-03-01',
            end_date: '2020-03-10'
        }];

        render(<NextTripWidget trips={trips} />);
        expect(screen.getByText('days ago')).toBeInTheDocument();
    });

    test('prefers future trip over past trip', () => {
        const future = new Date();
        future.setDate(future.getDate() + 3);
        const futureEnd = new Date(future);
        futureEnd.setDate(futureEnd.getDate() + 5);

        const trips = [
            { id: 1, city: 'Paris', country: 'France', start_date: '2019-01-01', end_date: '2019-01-05' },
            { id: 2, city: 'Tokyo', country: 'Japan', start_date: future.toISOString().split('T')[0], end_date: futureEnd.toISOString().split('T')[0] }
        ];

        render(<NextTripWidget trips={trips} />);
        expect(screen.getByText('Tokyo, Japan')).toBeInTheDocument();
    });
});

// ─── MonthStrip ───────────────────────────────────────────────────────────────
describe('MonthStrip', () => {
    const mockProps = {
        trips: [],
        selectedYear: 2025,
        setSelectedYear: jest.fn(),
        selectedMonth: null,
        setSelectedMonth: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders all 12 month labels', () => {
        render(<MonthStrip {...mockProps} />);
        ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].forEach(m => {
            expect(screen.getByText(m)).toBeInTheDocument();
        });
    });

    test('renders selected year', () => {
        render(<MonthStrip {...mockProps} selectedYear={2024} />);
        expect(screen.getByText('2024')).toBeInTheDocument();
    });

    test('calls setSelectedYear with decremented year on prev click', () => {
        const setSelectedYear = jest.fn();
        render(<MonthStrip {...mockProps} setSelectedYear={setSelectedYear} selectedYear={2025} />);
        fireEvent.click(screen.getByText('<'));
        expect(setSelectedYear).toHaveBeenCalledTimes(1);
    });

    test('calls setSelectedYear with incremented year on next click', () => {
        const setSelectedYear = jest.fn();
        render(<MonthStrip {...mockProps} setSelectedYear={setSelectedYear} selectedYear={2025} />);
        fireEvent.click(screen.getByText('>'));
        expect(setSelectedYear).toHaveBeenCalledTimes(1);
    });

    test('does not call setSelectedMonth when clicking month with no trips', () => {
        const setSelectedMonth = jest.fn();
        render(<MonthStrip {...mockProps} trips={[]} setSelectedMonth={setSelectedMonth} />);
        fireEvent.click(screen.getByText('jan'));
        expect(setSelectedMonth).not.toHaveBeenCalled();
    });

    test('calls setSelectedMonth when clicking month that has trips', () => {
        const setSelectedMonth = jest.fn();
        const trips = [{ id: 1, start_date: '2025-03-01', end_date: '2025-03-15' }];
        render(<MonthStrip {...mockProps} trips={trips} setSelectedMonth={setSelectedMonth} selectedYear={2025} />);
        fireEvent.click(screen.getByText('mar'));
        expect(setSelectedMonth).toHaveBeenCalledTimes(1);
    });

    test('marks month as active if trip overlaps', () => {
        const trips = [{ id: 1, start_date: '2025-06-10', end_date: '2025-06-20' }];
        const { container } = render(<MonthStrip {...mockProps} trips={trips} selectedYear={2025} />);
        const junPill = container.querySelectorAll('.month-pill')[5]; // june = index 5
        expect(junPill).toHaveClass('active');
    });

    test('marks month without trips as empty', () => {
        const { container } = render(<MonthStrip {...mockProps} trips={[]} />);
        const janPill = container.querySelectorAll('.month-pill')[0];
        expect(janPill).toHaveClass('empty');
    });
});
