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
export interface CreateUserData {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role?: string;
}
export interface UpdateUserData {
    email?: string;
    password?: string;
    first_name?: string;
    last_name?: string;
    role?: string;
    is_active?: boolean;
}
export declare const userService: {
    getAll(search?: string): Promise<User[]>;
    getById(id: string): Promise<User>;
    create(data: CreateUserData): Promise<User>;
    update(id: string, data: UpdateUserData): Promise<User>;
    delete(id: string): Promise<void>;
};
export default userService;
