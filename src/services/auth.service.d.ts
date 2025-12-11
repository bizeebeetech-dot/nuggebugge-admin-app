export interface LoginRequest {
    email: string;
    password: string;
}
export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
export interface LoginResponse {
    success: boolean;
    data: {
        user: User;
        token: string;
    };
    message: string;
}
export declare const authService: {
    login(credentials: LoginRequest): Promise<LoginResponse>;
    logout(): void;
    isAuthenticated(): boolean;
    getUser(): User | null;
    getToken(): string | null;
};
export default authService;
