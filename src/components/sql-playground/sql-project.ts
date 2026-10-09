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

export class TpSqlProject extends TpProject {
  public setup?: string;

  public database?: TpSqlDatabase;

  public databases?: TpSqlDatabase[];

  public constructor(init: TpSqlProjectInit = {}) {
    super(init);
    this.setup = init.setup;
    this.database = init.database;
    this.databases = init.databases;
  }

  public getActiveDatabase(): TpSqlDatabase | undefined {
    return (
      this.databases?.find((database) => database.active === true) ??
      this.database
    );
  }

  public override clone(): TpSqlProject {
    return new TpSqlProject({
      name: this.name,
      entry: this.entry,
      test: this.test,
      setup: this.setup,
      database:
        this.database !== undefined ? { ...this.database } : undefined,
      databases: this.databases?.map((database) => ({ ...database })),
      files: this.files.map((file) => ({ ...file })),
    });
  }

  public override toJSON(): TpSqlProjectInit {
    return {
      name: this.name,
      entry: this.entry,
      test: this.test,
      setup: this.setup,
      database:
        this.database !== undefined ? { ...this.database } : undefined,
      databases: this.databases?.map((database) => ({ ...database })),
      files: this.files.map((file) => ({ ...file })),
    };
  }
}