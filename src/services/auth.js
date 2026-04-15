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
        this.removeRole();
        this.removeUsername();
    },

    setRole(role) {
        localStorage.setItem('userRole', role);
    },

    getRole() {
        return localStorage.getItem('userRole');
    },

    removeRole() {
        localStorage.removeItem('userRole');
    },

    setUsername(name) {
        localStorage.setItem('userName', name);
    },

    getUsername() {
        return localStorage.getItem('userName') || 'Traveler'; 
    },

    removeUsername() {
        localStorage.removeItem('userName');
    }

};