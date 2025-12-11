export interface School {
    id: string;
    name: string;
    state_id?: string;
    state_name?: string;
    district_id?: string;
    district_name?: string;
    board_id?: string;
    board_name?: string;
    address?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
export interface SchoolDropdowns {
    states: {
        id: string;
        name: string;
    }[];
    districts: {
        id: string;
        name: string;
        state_id?: string;
    }[];
    boards: {
        id: string;
        name: string;
    }[];
}
export interface CreateSchoolData {
    name: string;
    state_id?: string;
    district_id?: string;
    board_id?: string;
    address?: string;
}
export interface UpdateSchoolData {
    name?: string;
    state_id?: string;
    district_id?: string;
    board_id?: string;
    address?: string;
    is_active?: boolean;
}
declare class SchoolService {
    getAll(search?: string): Promise<School[]>;
    getById(id: string): Promise<School>;
    create(data: CreateSchoolData): Promise<School>;
    update(id: string, data: UpdateSchoolData): Promise<School>;
    delete(id: string): Promise<void>;
    getDropdowns(): Promise<SchoolDropdowns>;
}
export declare const schoolService: SchoolService;
export default schoolService;
