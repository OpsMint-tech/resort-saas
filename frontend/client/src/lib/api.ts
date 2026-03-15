const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

async function request(endpoint: string, options: any = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        (headers as any).Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}

export const authApi = {
    register: (data: any, adminSecret?: string) =>
        request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: adminSecret ? { 'x-admin-secret': adminSecret } : {}
        }),
    verifyOTP: (data: { email: string; otp: string }) =>
        request('/auth/verify-otp', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: any) =>
        request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
};

export const resortApi = {
    getAll: (search?: string, category?: string) => {
        let url = '/resorts?';
        if (search) url += `search=${encodeURIComponent(search)}&`;
        if (category) url += `category=${encodeURIComponent(category)}`;
        return request(url);
    },
    getById: (id: string | number) => request(`/resorts/${id}`),
    create: (data: any) => request('/resorts', { method: 'POST', body: JSON.stringify(data) }),
    getOwnerResorts: () => request('/resorts/my'),
    adminGetAll: () => request('/resorts/all'),
    updateStatus: (id: string | number, status: string) =>
        request(`/resorts/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    update: (id: string | number, data: any) =>
        request(`/resorts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string | number) => request(`/resorts/${id}`, { method: 'DELETE' }),
};

export const bookingApi = {
    create: (data: any) => request('/bookings', { method: 'POST', body: JSON.stringify(data) }),
    getMyBookings: () => request('/bookings/my'),
    getOwnerSales: () => request('/bookings/owner/sales'),
    getOwnerDashboard: () => request('/bookings/owner/dashboard'),
    getAdminDashboard: () => request('/bookings/admin/dashboard'),
    getAdminSales: () => request('/bookings/admin/sales'),
    updateStatus: (id: string | number, status: string) =>
        request(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};
