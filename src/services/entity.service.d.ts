export interface Entity {
    id: number;
    name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
export interface EntityResponse {
    success: boolean;
    data: Entity[];
    count: number;
}
export interface SingleEntityResponse {
    success: boolean;
    data: Entity;
    message?: string;
}
export type EntityType = 'state' | 'degree' | 'branch' | 'batch' | 'implementation_year' | 'activity_category' | 'activity_type';
export declare const entityService: {
    getAll(entityType: EntityType, search?: string): Promise<Entity[]>;
    getById(entityType: EntityType, id: number): Promise<Entity>;
    create(entityType: EntityType, data: {
        name: string;
    }): Promise<Entity>;
    update(entityType: EntityType, id: number, data: {
        name?: string;
        is_active?: boolean;
    }): Promise<Entity>;
    toggleActive(entityType: EntityType, id: number): Promise<Entity>;
    delete(entityType: EntityType, id: number): Promise<void>;
};
export default entityService;
