export interface User {
    id: string;
    first_name: string;
    last_name: string;
    designation?: string;
    employee_id?: string;
    email: string;
    username?: string;
    role: string;
    is_enabled: boolean;
    is_deactivated: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
export interface CreateUserData {
    first_name: string;
    last_name: string;
    designation?: string;
    employee_id?: string;
    email: string;
    username?: string;
    password: string;
    role?: string;
}
export interface UpdateUserData {
    first_name?: string;
    last_name?: string;
    designation?: string;
    employee_id?: string;
    email?: string;
    username?: string;
    password?: string;
    role?: string;
    is_enabled?: boolean;
    is_deactivated?: boolean;
    is_active?: boolean;
}
export declare const userService: {
    getAll(search?: string): Promise<User[]>;
    getById(id: string): Promise<User>;
    create(data: CreateUserData): Promise<User>;
    update(id: string, data: UpdateUserData): Promise<User>;
    delete(id: string): Promise<void>;
    resetPassword(id: string, newPassword: string): Promise<User>;
    toggleEnabled(id: string, is_enabled: boolean): Promise<User>;
    deactivateUser(id: string): Promise<User>;
    activateUser(id: string): Promise<User>;
};
export default userService;
