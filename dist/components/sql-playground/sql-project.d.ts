import { TpProject, type TpProjectInit } from '../playground/project.js';
export type TpSqlDatabaseType = 'sql' | 'sqlite';
export interface TpSqlDatabase {
    id: string;
    name: string;
    type: TpSqlDatabaseType;
    path: string;
    storageKey?: string;
    active?: boolean;
}
export interface TpSqlProjectInit extends TpProjectInit {
    setup?: string;
    database?: TpSqlDatabase;
    databases?: TpSqlDatabase[];
}
export declare class TpSqlProject extends TpProject {
    setup?: string;
    database?: TpSqlDatabase;
    databases?: TpSqlDatabase[];
    constructor(init?: TpSqlProjectInit);
    getActiveDatabase(): TpSqlDatabase | undefined;
    clone(): TpSqlProject;
    toJSON(): TpSqlProjectInit;
}
