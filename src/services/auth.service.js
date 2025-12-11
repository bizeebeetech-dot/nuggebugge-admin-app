import api from './api';
export const authService = {
    async login(credentials) {
        const response = await api.post('/users/login', credentials);
        if (response.data.success && response.data.data.token) {
            localStorage.setItem('authToken', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },
    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },
    isAuthenticated() {
        return !!localStorage.getItem('authToken');
    },
    getUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },
    getToken() {
        return localStorage.getItem('authToken');
    },
};
export default authService;
