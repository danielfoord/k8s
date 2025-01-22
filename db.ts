import { Client } from "https://deno.land/x/postgres@v0.17.0/client.ts";
import { Config } from "./types.ts";

// db.ts
export interface DatabaseClient {
  connect(): Promise<void>;
  // deno-lint-ignore no-explicit-any
  queryObject(query: string, params?: any[]): Promise<{ rows: any[] }>;
}


export class PostgresClient implements DatabaseClient {
  private client: Client;

  constructor(config: Config) {
    this.client = new Client({
      user: config.postgresUser,
      password: config.postgresPassword,
      database: config.postgresDb,
      hostname: config.postgresHost,
      port: 5432,
    });
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  // deno-lint-ignore no-explicit-any
  async queryObject(query: string, params?: any[]): Promise<{ rows: any[] }> {
    return await this.client.queryObject(query, params);
  }
}