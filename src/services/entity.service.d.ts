export interface Entity {
    id: string | number;
    name: string;
    state_id?: string;
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
export type EntityType = 'state' | 'district' | 'school_board';
export declare const entityLabels: Record<EntityType, string>;
export declare const entityService: {
    getAll(entityType: EntityType, search?: string): Promise<Entity[]>;
    getById(entityType: EntityType, id: string | number): Promise<Entity>;
    create(entityType: EntityType, data: {
        name: string;
        state_id?: string;
    }): Promise<Entity>;
    update(entityType: EntityType, id: string | number, data: {
        name?: string;
        state_id?: string;
        is_active?: boolean;
    }): Promise<Entity>;
    toggleActive(entityType: EntityType, id: string | number): Promise<Entity>;
    delete(entityType: EntityType, id: string | number): Promise<void>;
};
export default entityService;
