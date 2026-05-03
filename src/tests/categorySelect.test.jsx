import { render, screen, fireEvent } from '@testing-library/react';
import CategorySelect from '../components/UI/CategorySelect';

describe('CategorySelect component', () => {
    test('renders label when provided', () => {
        render(<CategorySelect label="Category" value="" onChange={() => {}} />);
        expect(screen.getByText('Category')).toBeInTheDocument();
    });

    test('shows placeholder when no value selected', () => {
        render(<CategorySelect value="" onChange={() => {}} />);
        expect(screen.getByText('select category')).toBeInTheDocument();
    });

    test('shows selected category when value is set', () => {
        render(<CategorySelect value="food" onChange={() => {}} />);
        expect(screen.getByText('food & drinks')).toBeInTheDocument();
    });

    test('opens dropdown on trigger click', () => {
        render(<CategorySelect value="" onChange={() => {}} />);
        fireEvent.click(screen.getByText('select category').closest('.select-trigger'));
        expect(screen.getByText('transport')).toBeInTheDocument();
    });

    test('closes dropdown after selecting an item', () => {
        render(<CategorySelect value="" onChange={() => {}} />);
        fireEvent.click(screen.getByText('select category').closest('.select-trigger'));
        fireEvent.click(screen.getByText('transport'));
        expect(screen.queryByText('sightseeing')).not.toBeInTheDocument();
    });

    test('calls onChange with correct key when item selected', () => {
        const onChange = jest.fn();
        render(<CategorySelect value="" onChange={onChange} />);
        fireEvent.click(document.querySelector('.select-trigger'));
        fireEvent.click(screen.getByText('transport'));
        expect(onChange).toHaveBeenCalledWith('transport');
    });

    test('shows arrow indicator', () => {
        render(<CategorySelect value="" onChange={() => {}} />);
        expect(screen.getByText('▼')).toBeInTheDocument();
    });

    test('shows all 6 categories in dropdown', () => {
        render(<CategorySelect value="" onChange={() => {}} />);
        fireEvent.click(document.querySelector('.select-trigger'));
        ['transport', 'food & drinks', 'sightseeing', 'entertainment', 'shopping', 'others'].forEach(label => {
            expect(screen.getByText(label)).toBeInTheDocument();
        });
    });

    test('marks active category in dropdown', () => {
        render(<CategorySelect value="shopping" onChange={() => {}} />);
        fireEvent.click(document.querySelector('.select-trigger'));
        // The selected-badge shows in the trigger, and in dropdown it gets 'active' class
        const activeItems = document.querySelectorAll('.select-item.active');
        expect(activeItems.length).toBeGreaterThan(0);
    });
});
