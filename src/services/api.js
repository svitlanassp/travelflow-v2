import { Auth } from './auth';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

async function request(endpoint, options = {}) {
    const token = Auth.getToken();
    const headers = options.headers || {};

    if (!options.isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
        Auth.logout(); // <--- Викликало window.location.href і перезавантажувало сторінку
        return null;
    }

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
    }

    return response.status === 204 ? true : response.json();
}

export const api = {
    login: (credentials) => request('/login/', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),
    register: (data) => request('/register/', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    getUsers: () => request('/users'),
    getUser: (id) => request(`/users/${id}/`),
    createUser: (data) => request('/users/', { 
        method: 'POST', 
        body: JSON.stringify({
            username: data.username,
            password: data.password,
            is_staff: data.role === 'admin'
        }) 
    }),
    updateUser: (id, data) => request(`/users/${id}/`, { 
        method: 'PUT', 
        body: JSON.stringify({
            username: data.username,
            is_staff: data.role === 'admin'
        }) 
    }),
    deleteUser: (id) => request(`/users/${id}/`, { 
        method: 'DELETE' 
    }),
    getTrips: () => request('/trips/'),
    getTrip: (id) => request(`/trips/${id}/`),
    createTrip: (formData) => request('/trips/', {
        method: 'POST',
        body: formData,
        isFormData: true 
    }),
};