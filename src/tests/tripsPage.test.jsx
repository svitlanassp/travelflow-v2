import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TripsPage from '../pages/TripsPage';
import { api } from '../services/api';
import { Auth } from '../services/auth';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../services/api', () => ({
    api: {
        getTrips: jest.fn(),
        deleteTrip: jest.fn(),
    }
}));

const futureTrip = {
    id: 1,
    title: 'Rome Adventure',
    city: 'Rome',
    country: 'Italy',
    start_date: '2030-06-01',
    end_date: '2030-06-10',
    total_budget: '1000',
    total_spent: '200',
};

const pastTrip = {
    id: 2,
    title: 'Old Paris Trip',
    city: 'Paris',
    country: 'France',
    start_date: '2020-01-01',
    end_date: '2020-01-10',
    total_budget: '500',
    total_spent: '500',
};

const renderPage = () => render(<MemoryRouter><TripsPage /></MemoryRouter>);

describe('TripsPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        Auth.setUsername('alice');
    });

    // ─── Loading & rendering ───
    test('shows loading state initially', () => {
        api.getTrips.mockReturnValue(new Promise(() => {})); 
        renderPage();
        expect(screen.getByText('fetching adventures...')).toBeInTheDocument();
    });

    test('shows welcome message with username', async () => {
        api.getTrips.mockResolvedValueOnce([futureTrip]);
        renderPage();
        await waitFor(() => {
            expect(screen.getByText(/welcome back, alice/)).toBeInTheDocument();
        });
    });

    test('shows empty state when no trips', async () => {
        api.getTrips.mockResolvedValueOnce([]);
        renderPage();
        await waitFor(() => {
            expect(screen.getByText('no trips yet')).toBeInTheDocument();
        });
    });

    test('renders trips after loading', async () => {
        api.getTrips.mockResolvedValueOnce([futureTrip]);
        renderPage();
        await waitFor(() => {
            expect(screen.getByText('Rome Adventure')).toBeInTheDocument();
        });
    });

    test('renders multiple trips', async () => {
        api.getTrips.mockResolvedValueOnce([futureTrip, pastTrip]);
        renderPage();
        await waitFor(() => {
            expect(screen.getByText('Rome Adventure')).toBeInTheDocument();
            expect(screen.getByText('Old Paris Trip')).toBeInTheDocument();
        });
    });

    // ─── Filter pills ───
    test('renders filter pills when trips exist', async () => {
        api.getTrips.mockResolvedValueOnce([futureTrip]);
        renderPage();
        await waitFor(() => {
            expect(screen.getByText('all')).toBeInTheDocument();
            expect(screen.getByText('active')).toBeInTheDocument();
            expect(screen.getByText('past')).toBeInTheDocument();
        });
    });

    test('does not render filter pills when no trips', async () => {
        api.getTrips.mockResolvedValueOnce([]);
        renderPage();
        await waitFor(() => {
            expect(screen.queryByText('active')).not.toBeInTheDocument();
        });
    });

    test('filter "active" shows only future trips', async () => {
        api.getTrips.mockResolvedValueOnce([futureTrip, pastTrip]);
        renderPage();
        await waitFor(() => screen.getByText('all'));
        fireEvent.click(screen.getByText('active'));
        expect(screen.getByText('Rome Adventure')).toBeInTheDocument();
        expect(screen.queryByText('Old Paris Trip')).not.toBeInTheDocument();
    });

    test('filter "past" shows only past trips', async () => {
        api.getTrips.mockResolvedValueOnce([futureTrip, pastTrip]);
        renderPage();
        await waitFor(() => screen.getByText('all'));
        fireEvent.click(screen.getByText('past'));
        expect(screen.queryByText('Rome Adventure')).not.toBeInTheDocument();
        expect(screen.getByText('Old Paris Trip')).toBeInTheDocument();
    });

    test('filter "all" shows all trips', async () => {
        api.getTrips.mockResolvedValueOnce([futureTrip, pastTrip]);
        renderPage();
        await waitFor(() => screen.getByText('all'));
        fireEvent.click(screen.getByText('past'));
        fireEvent.click(screen.getByText('all'));
        expect(screen.getByText('Rome Adventure')).toBeInTheDocument();
        expect(screen.getByText('Old Paris Trip')).toBeInTheDocument();
    });

});
