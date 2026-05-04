import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import { api } from '../services/api';
import { Auth } from '../services/auth';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../services/api', () => ({
    api: {
        login: jest.fn(),
        register: jest.fn(),
    }
}));

const renderLogin = () => render(<MemoryRouter><LoginPage /></MemoryRouter>);
const renderRegister = () => render(<MemoryRouter><RegisterPage /></MemoryRouter>);

// ─── LoginPage ───
describe('LoginPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    test('renders sign in title', () => {
        renderLogin();
        expect(screen.getByText('sign in')).toBeInTheDocument();
    });

    test('renders username and password inputs', () => {
        renderLogin();
        expect(screen.getByPlaceholderText('your username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    });

    test('renders submit button', () => {
        renderLogin();
        expect(screen.getByRole('button', { name: '→ go' })).toBeInTheDocument();
    });

    test('renders sign up link', () => {
        renderLogin();
        expect(screen.getByText('sign up')).toBeInTheDocument();
    });

    test('updates username input on change', () => {
        renderLogin();
        const input = screen.getByPlaceholderText('your username');
        fireEvent.change(input, { target: { value: 'alice' } });
        expect(input.value).toBe('alice');
    });

    test('updates password input on change', () => {
        renderLogin();
        const input = screen.getByPlaceholderText('••••••••');
        fireEvent.change(input, { target: { value: 'secret' } });
        expect(input.value).toBe('secret');
    });

    test('shows error on failed login', async () => {
        api.login.mockRejectedValueOnce(new Error('fail'));
        renderLogin();
        fireEvent.submit(screen.getByRole('button', { name: '→ go' }).closest('form'));
        await waitFor(() => {
            expect(screen.getByText('invalid username or password')).toBeInTheDocument();
        });
    });

    test('shows error when api returns no access token', async () => {
        api.login.mockResolvedValueOnce({ role: 'regular' }); 
        renderLogin();
        fireEvent.submit(screen.getByRole('button', { name: '→ go' }).closest('form'));
        await waitFor(() => {
            expect(screen.getByText('invalid username or password')).toBeInTheDocument();
        });
    });

    test('navigates to /trips on successful login', async () => {
        api.login.mockResolvedValueOnce({ access: 'token123', role: 'admin' });
        renderLogin();
        fireEvent.change(screen.getByPlaceholderText('your username'), { target: { value: 'alice' } });
        fireEvent.submit(screen.getByRole('button', { name: '→ go' }).closest('form'));
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/trips');
        });
    });

    test('saves token and role to Auth on successful login', async () => {
        api.login.mockResolvedValueOnce({ access: 'mytoken', role: 'admin' });
        renderLogin();
        fireEvent.submit(screen.getByRole('button', { name: '→ go' }).closest('form'));
        await waitFor(() => {
            expect(Auth.getToken()).toBe('mytoken');
            expect(Auth.getRole()).toBe('admin');
        });
    });

    test('navigates to /register when sign up link clicked', () => {
        renderLogin();
        fireEvent.click(screen.getByText('sign up'));
        expect(mockNavigate).toHaveBeenCalledWith('/register');
    });
});

// ─── RegisterPage ───
describe('RegisterPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders sign up title', () => {
        renderRegister();
        expect(screen.getByText('sign up')).toBeInTheDocument();
    });

    test('renders all three inputs', () => {
        renderRegister();
        expect(screen.getByPlaceholderText('your username')).toBeInTheDocument();
        const passwordInputs = screen.getAllByPlaceholderText('••••••••');
        expect(passwordInputs).toHaveLength(2);
    });

    test('shows error when passwords do not match', async () => {
        renderRegister();
        fireEvent.change(screen.getByPlaceholderText('your username'), { target: { value: 'alice' } });
        const [passInput, confirmInput] = screen.getAllByPlaceholderText('••••••••');
        fireEvent.change(passInput, { target: { value: 'pass1' } });
        fireEvent.change(confirmInput, { target: { value: 'pass2' } });
        fireEvent.submit(screen.getByRole('button', { name: '→ go' }).closest('form'));
        await waitFor(() => {
            expect(screen.getByText("passwords don't match")).toBeInTheDocument();
        });
    });

    test('does not call api when passwords do not match', async () => {
        renderRegister();
        const [passInput, confirmInput] = screen.getAllByPlaceholderText('••••••••');
        fireEvent.change(passInput, { target: { value: 'aaa' } });
        fireEvent.change(confirmInput, { target: { value: 'bbb' } });
        fireEvent.submit(screen.getByRole('button', { name: '→ go' }).closest('form'));
        await waitFor(() => {
            expect(api.register).not.toHaveBeenCalled();
        });
    });

    test('navigates to /login on successful register', async () => {
        api.register.mockResolvedValueOnce({ id: 1 });
        renderRegister();
        fireEvent.change(screen.getByPlaceholderText('your username'), { target: { value: 'alice' } });
        const [passInput, confirmInput] = screen.getAllByPlaceholderText('••••••••');
        fireEvent.change(passInput, { target: { value: 'pass123' } });
        fireEvent.change(confirmInput, { target: { value: 'pass123' } });
        fireEvent.submit(screen.getByRole('button', { name: '→ go' }).closest('form'));
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });

    test('shows error on api failure', async () => {
        api.register.mockRejectedValueOnce(new Error('fail'));
        renderRegister();
        const [passInput, confirmInput] = screen.getAllByPlaceholderText('••••••••');
        fireEvent.change(passInput, { target: { value: 'pass' } });
        fireEvent.change(confirmInput, { target: { value: 'pass' } });
        fireEvent.submit(screen.getByRole('button', { name: '→ go' }).closest('form'));
        await waitFor(() => {
            expect(screen.getByText('something went wrong, try again')).toBeInTheDocument();
        });
    });

    test('navigates to /login when sign in link clicked', () => {
        renderRegister();
        fireEvent.click(screen.getByText('sign in'));
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
});
