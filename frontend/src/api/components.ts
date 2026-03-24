import api from './client';
import type { Component } from '../types';

export const componentsApi = {
    getAll: () =>
        api.get<Component[]>('/components'),

    getById: (id: number) =>
        api.get<Component>(`/components/${id}`),

    create: (data: { title: string; description?: string; category?: string; github_url?: string }) =>
        api.post<Component>('/components', data),

    update: (id: number, data: { title?: string; description?: string; category?: string; github_url?: string }) =>
        api.put<Component>(`/components/${id}`, data),

    delete: (id: number) =>
        api.delete(`/components/${id}`),
};
