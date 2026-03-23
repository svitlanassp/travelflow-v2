const TOKEN_KEY = 'accessToken';

export const Auth = {
    setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    },

    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    removeToken() {
        localStorage.removeItem(TOKEN_KEY);
    },

    isLoggedIn() {
        return !!this.getToken();
    },

    logout() {
        this.removeToken();
        window.location.href = '/login';
    },
};