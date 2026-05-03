import { render, screen, fireEvent } from '@testing-library/react';
import BudgetTab from '../components/BudgetTab/BudgetTab';

const makeTripBase = (overrides = {}) => ({
    id: 1,
    title: 'Test Trip',
    start_date: '2025-06-01',
    end_date: '2025-06-07',
    total_budget: '500',
    total_spent: '200',
    expenses: [],
    places: [],
    ...overrides
});

describe('BudgetTab component', () => {
    const noop = () => {};

    test('renders total budget when provided', () => {
        render(<BudgetTab trip={makeTripBase()} onAddExpense={noop} onDeleteClick={noop} onEditClick={noop} />);
        expect(screen.getByText('$500.00')).toBeInTheDocument();
    });

    test('renders total spent', () => {
        render(<BudgetTab trip={makeTripBase()} onAddExpense={noop} onDeleteClick={noop} onEditClick={noop} />);
        expect(screen.getByText('$200.00')).toBeInTheDocument();
    });

    test('renders remaining budget', () => {
        render(<BudgetTab trip={makeTripBase()} onAddExpense={noop} onDeleteClick={noop} onEditClick={noop} />);
        expect(screen.getByText('$300.00')).toBeInTheDocument();
    });

    test('does not show budget card when total_budget is 0', () => {
        render(<BudgetTab trip={makeTripBase({ total_budget: '0' })} onAddExpense={noop} onDeleteClick={noop} onEditClick={noop} />);
        expect(screen.queryByText('total budget')).not.toBeInTheDocument();
    });

    test('shows empty state when no expenses or places', () => {
        render(<BudgetTab trip={makeTripBase({ total_spent: '0' })} onAddExpense={noop} onDeleteClick={noop} onEditClick={noop} />);
        expect(screen.getByText('no expenses yet')).toBeInTheDocument();
        expect(screen.getByText('no spending data yet')).toBeInTheDocument();
    });

    test('renders expenses list', () => {
        const trip = makeTripBase({
            expenses: [{ id: 1, title: 'Lunch', category: 'food', amount: '25', date: '2025-06-02' }],
            total_spent: '25'
        });
        render(<BudgetTab trip={trip} onAddExpense={noop} onDeleteClick={noop} onEditClick={noop} />);
        expect(screen.getByText('Lunch')).toBeInTheDocument();
    });

    test('renders place with cost in expenses list', () => {
        const trip = makeTripBase({
            places: [{ id: 1, title: 'Colosseum', category: 'sightseeing', cost: '30', visit_date: '2025-06-03' }],
            total_spent: '30'
        });
        render(<BudgetTab trip={trip} onAddExpense={noop} onDeleteClick={noop} onEditClick={noop} />);
        expect(screen.getByText('Colosseum')).toBeInTheDocument();
    });

    test('calls onAddExpense when "+ new expense" button clicked', () => {
        const onAddExpense = jest.fn();
        render(<BudgetTab trip={makeTripBase()} onAddExpense={onAddExpense} onDeleteClick={noop} onEditClick={noop} />);
        fireEvent.click(screen.getByText('+ new expense'));
        expect(onAddExpense).toHaveBeenCalledTimes(1);
    });

    test('calls onDeleteClick when delete button clicked on expense', () => {
        const onDeleteClick = jest.fn();
        const trip = makeTripBase({
            expenses: [{ id: 1, title: 'Hotel', category: 'others', amount: '100', date: '2025-06-01' }],
            total_spent: '100'
        });
        render(<BudgetTab trip={trip} onAddExpense={noop} onDeleteClick={onDeleteClick} onEditClick={noop} />);
        fireEvent.click(screen.getByText('×'));
        expect(onDeleteClick).toHaveBeenCalledTimes(1);
    });

    test('calls onEditClick when expense item clicked', () => {
        const onEditClick = jest.fn();
        const trip = makeTripBase({
            expenses: [{ id: 1, title: 'Taxi', category: 'transport', amount: '15', date: '2025-06-02' }],
            total_spent: '15'
        });
        render(<BudgetTab trip={trip} onAddExpense={noop} onDeleteClick={noop} onEditClick={onEditClick} />);
        fireEvent.click(screen.getByText('Taxi').closest('.expense-item'));
        expect(onEditClick).toHaveBeenCalledTimes(1);
    });

    test('shows item count in "across X items" label', () => {
        const trip = makeTripBase({
            expenses: [{ id: 1, title: 'Food', category: 'food', amount: '20', date: '2025-06-01' }],
            places: [{ id: 2, title: 'Museum', category: 'sightseeing', cost: '10', visit_date: '2025-06-02' }],
            total_spent: '30'
        });
        render(<BudgetTab trip={trip} onAddExpense={noop} onDeleteClick={noop} onEditClick={noop} />);
        expect(screen.getByText('across 2 items')).toBeInTheDocument();
    });

    test('renders spending breakdown section title', () => {
        render(<BudgetTab trip={makeTripBase()} onAddExpense={noop} onDeleteClick={noop} onEditClick={noop} />);
        expect(screen.getByText('spending breakdown')).toBeInTheDocument();
    });

    test('renders all expenses section title', () => {
        render(<BudgetTab trip={makeTripBase()} onAddExpense={noop} onDeleteClick={noop} onEditClick={noop} />);
        expect(screen.getByText('all expenses')).toBeInTheDocument();
    });

    test('remaining budget is never negative', () => {
        const trip = makeTripBase({ total_budget: '100', total_spent: '200' });
        render(<BudgetTab trip={trip} onAddExpense={noop} onDeleteClick={noop} onEditClick={noop} />);
        expect(screen.getByText('$0.00')).toBeInTheDocument();
    });
});
