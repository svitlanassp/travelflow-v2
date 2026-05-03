import { Auth } from '../services/auth';

describe('Auth service', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe('Token management', () => {
        test('setToken stores token in localStorage', () => {
            Auth.setToken('mytoken123');
            expect(localStorage.getItem('accessToken')).toBe('mytoken123');
        });

        test('getToken returns stored token', () => {
            localStorage.setItem('accessToken', 'abc');
            expect(Auth.getToken()).toBe('abc');
        });

        test('getToken returns null when no token', () => {
            expect(Auth.getToken()).toBeNull();
        });

        test('removeToken deletes token from localStorage', () => {
            Auth.setToken('token');
            Auth.removeToken();
            expect(Auth.getToken()).toBeNull();
        });
    });

    describe('isLoggedIn', () => {
        test('returns true when token exists', () => {
            Auth.setToken('sometoken');
            expect(Auth.isLoggedIn()).toBe(true);
        });

        test('returns false when no token', () => {
            expect(Auth.isLoggedIn()).toBe(false);
        });
    });

    describe('logout', () => {
        test('removes token, role, and username', () => {
            Auth.setToken('tok');
            Auth.setRole('admin');
            Auth.setUsername('alice');
            Auth.logout();
            expect(Auth.getToken()).toBeNull();
            expect(Auth.getRole()).toBeNull();
            expect(Auth.getUsername()).toBe('Traveler');
        });
    });

    describe('Role management', () => {
        test('setRole and getRole work correctly', () => {
            Auth.setRole('admin');
            expect(Auth.getRole()).toBe('admin');
        });

        test('removeRole deletes role', () => {
            Auth.setRole('admin');
            Auth.removeRole();
            expect(Auth.getRole()).toBeNull();
        });
    });

    describe('Username management', () => {
        test('setUsername and getUsername work correctly', () => {
            Auth.setUsername('bob');
            expect(Auth.getUsername()).toBe('bob');
        });

        test('getUsername returns "Traveler" as default', () => {
            expect(Auth.getUsername()).toBe('Traveler');
        });

        test('removeUsername causes default to be returned', () => {
            Auth.setUsername('alice');
            Auth.removeUsername();
            expect(Auth.getUsername()).toBe('Traveler');
        });
    });
});
