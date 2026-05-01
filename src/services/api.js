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
        Auth.logout(); 
        return null;
    }

    if (!response.ok) {
        let errorData;
        try {
            // Пробуємо прочитати JSON з помилкою від Джанго
            errorData = await response.json();
        } catch (e) {
            // Якщо Джанго впав і повернув не JSON, а просто HTML сторінку з 500 помилкою
            errorData = { detail: "Server error or invalid response" };
        }

        // Створюємо "розумну" помилку, в яку кладемо статус і самі дані
        const customError = new Error("API request failed");
        customError.response = {
            status: response.status,
            data: errorData
        };
        
        throw customError;
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
    updateTrip: (id, formData) => request(`/trips/${id}/`, {
        method: 'PUT',
        body: formData,
        isFormData: true 
    }),
    deleteTrip: (id) => request(`/trips/${id}/`, {
        method: 'DELETE'
    }),
    createExpense: (data) => request('/expenses/', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    createPlace: (data) => request('/places/', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updatePlace: (id, data) => request(`/places/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(data) 
    }),
    deleteExpense: (id) => request(`/expenses/${id}/`, { method: 'DELETE' }),
    deletePlace: (id) => request(`/places/${id}/`, { method: 'DELETE' }),
    updateExpense: (id, data) => request(`/expenses/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
};