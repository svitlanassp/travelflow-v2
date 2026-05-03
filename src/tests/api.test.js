import { api } from '../services/api';
import { Auth } from '../services/auth';

global.fetch = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
});

const mockOk = (data, status = 200) => {
    global.fetch.mockResolvedValueOnce({
        ok: true,
        status,
        json: async () => data,
    });
};

const mockFail = (status, data) => {
    global.fetch.mockResolvedValueOnce({
        ok: false,
        status,
        json: async () => data,
    });
};

describe('api service', () => {
    describe('login', () => {
        test('calls correct endpoint with credentials', async () => {
            mockOk({ access: 'token123', role: 'regular' });
            await api.login({ username: 'alice', password: 'pass' });
            expect(fetch).toHaveBeenCalledWith(
                'http://127.0.0.1:8000/api/login/',
                expect.objectContaining({ method: 'POST' })
            );
        });

        test('returns data on success', async () => {
            mockOk({ access: 'token123', role: 'admin' });
            const result = await api.login({ username: 'a', password: 'b' });
            expect(result.access).toBe('token123');
        });
    });

    describe('getTrips', () => {
        test('calls /trips/ endpoint', async () => {
            mockOk([]);
            await api.getTrips();
            expect(fetch).toHaveBeenCalledWith(
                'http://127.0.0.1:8000/api/trips/',
                expect.any(Object)
            );
        });

        test('includes Authorization header when token exists', async () => {
            Auth.setToken('mytoken');
            mockOk([]);
            await api.getTrips();
            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({ Authorization: 'Bearer mytoken' })
                })
            );
        });
    });

    describe('deleteTrip', () => {
        test('calls DELETE method', async () => {
            global.fetch.mockResolvedValueOnce({ ok: true, status: 204, json: async () => null });
            await api.deleteTrip(5);
            expect(fetch).toHaveBeenCalledWith(
                'http://127.0.0.1:8000/api/trips/5/',
                expect.objectContaining({ method: 'DELETE' })
            );
        });
    });

    describe('error handling', () => {
        test('throws error with response data on non-ok response', async () => {
            mockFail(400, { title: ['This field is required'] });
            await expect(api.createTrip(new FormData())).rejects.toThrow('API request failed');
        });

        test('logs out and returns null on 401', async () => {
            Auth.setToken('expired');
            global.fetch.mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({}) });
            const result = await api.getTrips();
            expect(result).toBeNull();
            expect(Auth.isLoggedIn()).toBe(false);
        });

        test('attaches response object to thrown error', async () => {
            mockFail(400, { detail: 'Bad request' });
            let caught;
            try {
                await api.getUser(999);
            } catch (e) {
                caught = e;
            }
            expect(caught.response.status).toBe(400);
            expect(caught.response.data.detail).toBe('Bad request');
        });
    });

    describe('createExpense', () => {
        test('calls POST /expenses/', async () => {
            mockOk({ id: 1, title: 'Coffee', amount: '5' });
            await api.createExpense({ title: 'Coffee', amount: 5 });
            expect(fetch).toHaveBeenCalledWith(
                'http://127.0.0.1:8000/api/expenses/',
                expect.objectContaining({ method: 'POST' })
            );
        });
    });

    describe('deletePlace', () => {
        test('calls DELETE /places/:id/', async () => {
            global.fetch.mockResolvedValueOnce({ ok: true, status: 204, json: async () => null });
            await api.deletePlace(3);
            expect(fetch).toHaveBeenCalledWith(
                'http://127.0.0.1:8000/api/places/3/',
                expect.objectContaining({ method: 'DELETE' })
            );
        });
    });

    describe('register', () => {
        test('calls POST /register/', async () => {
            mockOk({ id: 1 });
            await api.register({ username: 'newuser', password: 'pass', password_confirm: 'pass' });
            expect(fetch).toHaveBeenCalledWith(
                'http://127.0.0.1:8000/api/register/',
                expect.objectContaining({ method: 'POST' })
            );
        });
    });

    describe('updateExpense', () => {
        test('calls PUT /expenses/:id/', async () => {
            mockOk({ id: 2, amount: '50' });
            await api.updateExpense(2, { amount: 50 });
            expect(fetch).toHaveBeenCalledWith(
                'http://127.0.0.1:8000/api/expenses/2/',
                expect.objectContaining({ method: 'PUT' })
            );
        });
    });
});
