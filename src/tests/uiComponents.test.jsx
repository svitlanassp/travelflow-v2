import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../components/UI/Input';
import BaseModal from '../components/UI/BaseModal';
import ConfirmModal from '../components/UI/ConfirmModal';
import ErrorModal from '../components/UI/ErrorModal';

// ─── Input ───────────────────────────────────────────────────────────────────
describe('Input component', () => {
    test('renders with label', () => {
        render(<Input label="Username" name="username" />);
        expect(screen.getByText('Username')).toBeInTheDocument();
    });

    test('renders without label', () => {
        render(<Input name="username" />);
        expect(screen.queryByText('Username')).not.toBeInTheDocument();
    });

    test('renders input element by default', () => {
        render(<Input name="test" placeholder="Type here" />);
        expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
    });

    test('renders textarea when as="textarea"', () => {
        render(<Input as="textarea" name="notes" placeholder="Notes" />);
        const textarea = screen.getByPlaceholderText('Notes');
        expect(textarea.tagName).toBe('TEXTAREA');
    });

    test('shows error message when error prop provided', () => {
        render(<Input name="test" error="This field is required" />);
        expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    test('applies input-error class when error prop provided', () => {
        render(<Input name="test" error="Error!" placeholder="test" />);
        const input = screen.getByPlaceholderText('test');
        expect(input).toHaveClass('input-error');
    });

    test('does not show error span when no error', () => {
        render(<Input name="test" placeholder="test" />);
        expect(screen.queryByText('Error!')).not.toBeInTheDocument();
    });

    test('calls onChange handler', () => {
        const handleChange = jest.fn();
        render(<Input name="test" placeholder="test" onChange={handleChange} />);
        fireEvent.change(screen.getByPlaceholderText('test'), { target: { value: 'hello' } });
        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    test('reflects value prop', () => {
        render(<Input name="test" placeholder="test" value="myvalue" onChange={() => {}} />);
        expect(screen.getByPlaceholderText('test').value).toBe('myvalue');
    });
});

// ─── BaseModal ───────────────────────────────────────────────────────────────
describe('BaseModal component', () => {
    test('renders nothing when isOpen=false', () => {
        render(<BaseModal isOpen={false} onClose={() => {}} title="Test"><p>Content</p></BaseModal>);
        expect(screen.queryByText('Test ✦')).not.toBeInTheDocument();
    });

    test('renders title and children when isOpen=true', () => {
        render(<BaseModal isOpen={true} onClose={() => {}} title="My Modal"><p>Modal content</p></BaseModal>);
        expect(screen.getByText('My Modal ✦')).toBeInTheDocument();
        expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    test('calls onClose when overlay clicked', () => {
        const onClose = jest.fn();
        render(<BaseModal isOpen={true} onClose={onClose} title="Test"><p>Inner content</p></BaseModal>);
        fireEvent.click(document.querySelector('.modal-overlay'));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('does not call onClose when card clicked', () => {
        const onClose = jest.fn();
        render(<BaseModal isOpen={true} onClose={onClose} title="Test"><p>Inner content</p></BaseModal>);
        fireEvent.click(screen.getByText('Inner content'));
        expect(onClose).not.toHaveBeenCalled();
    });
});

// ─── ConfirmModal ─────────────────────────────────────────────────────────────
describe('ConfirmModal component', () => {
    test('renders nothing when isOpen=false', () => {
        render(<ConfirmModal isOpen={false} onClose={() => {}} onConfirm={() => {}} title="Delete?" message="Sure?" />);
        expect(screen.queryByText('Delete?')).not.toBeInTheDocument();
    });

    test('renders title and message when open', () => {
        render(<ConfirmModal isOpen={true} onClose={() => {}} onConfirm={() => {}} title="Delete?" message="Sure?" />);
        expect(screen.getByText('Delete?')).toBeInTheDocument();
        expect(screen.getByText('Sure?')).toBeInTheDocument();
    });

    test('shows default button texts', () => {
        render(<ConfirmModal isOpen={true} onClose={() => {}} onConfirm={() => {}} title="T" message="M" />);
        expect(screen.getByText('confirm')).toBeInTheDocument();
        expect(screen.getByText('cancel')).toBeInTheDocument();
    });

    test('shows custom confirm/cancel text', () => {
        render(<ConfirmModal isOpen={true} onClose={() => {}} onConfirm={() => {}} title="T" message="M" confirmText="yes" cancelText="no" />);
        expect(screen.getByText('yes')).toBeInTheDocument();
        expect(screen.getByText('no')).toBeInTheDocument();
    });

    test('calls onConfirm when confirm button clicked', () => {
        const onConfirm = jest.fn();
        render(<ConfirmModal isOpen={true} onClose={() => {}} onConfirm={onConfirm} title="T" message="M" confirmText="delete" />);
        fireEvent.click(screen.getByText('delete'));
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    test('calls onClose when cancel button clicked', () => {
        const onClose = jest.fn();
        render(<ConfirmModal isOpen={true} onClose={onClose} onConfirm={() => {}} title="T" message="M" />);
        fireEvent.click(screen.getByText('cancel'));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('shows processing state text', () => {
        render(<ConfirmModal isOpen={true} onClose={() => {}} onConfirm={() => {}} title="T" message="M" isProcessing={true} />);
        expect(screen.getByText('processing...')).toBeInTheDocument();
    });

    test('disables buttons when isProcessing=true', () => {
        render(<ConfirmModal isOpen={true} onClose={() => {}} onConfirm={() => {}} title="T" message="M" isProcessing={true} />);
        expect(screen.getByText('cancel')).toBeDisabled();
        expect(screen.getByText('processing...')).toBeDisabled();
    });
});

// ─── ErrorModal ───────────────────────────────────────────────────────────────
describe('ErrorModal component', () => {
    test('renders nothing when isOpen=false', () => {
        render(<ErrorModal isOpen={false} onClose={() => {}} message="Error!" />);
        expect(screen.queryByText('Error!')).not.toBeInTheDocument();
    });

    test('renders default title and message when open', () => {
        render(<ErrorModal isOpen={true} onClose={() => {}} message="Something broke" />);
        expect(screen.getByText('oops, something went wrong')).toBeInTheDocument();
        expect(screen.getByText('Something broke')).toBeInTheDocument();
    });

    test('renders custom title', () => {
        render(<ErrorModal isOpen={true} onClose={() => {}} title="Custom Error" message="Msg" />);
        expect(screen.getByText('Custom Error')).toBeInTheDocument();
    });

    test('calls onClose when ok button clicked', () => {
        const onClose = jest.fn();
        render(<ErrorModal isOpen={true} onClose={onClose} message="Msg" />);
        fireEvent.click(screen.getByText('ok, got it'));
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
