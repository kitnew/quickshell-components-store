export interface User {
    id: number;
    username: string;
    email: string;
    created_at: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface Component {
    id: number;
    title: string;
    description: string | null;
    category: string | null;
    github_url: string | null;
    author_id: number;
    created_at: string;
    updated_at: string;
}

export interface ApiError {
    error: string;
}
