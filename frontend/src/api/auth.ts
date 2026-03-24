import api from './client';
import type { AuthResponse } from '../types';

export const authApi = {
    register: (data: { username: string; email: string; password: string }) =>
        api.post<AuthResponse>('/auth/register', data),

    login: (data: { email: string; password: string }) =>
        api.post<AuthResponse>('/auth/login', data),

    me: () =>
        api.get<AuthResponse['user']>('/auth/me'),
};
