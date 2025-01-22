import { Client } from "https://deno.land/x/postgres@v0.17.0/client.ts";
import type { QueryObjectResult } from "https://deno.land/x/postgres@v0.17.0/query/query.ts";
import { Config } from "./types.ts";

export interface DatabaseClient {
  connect(): Promise<void>;
  queryObject<T>(query: string, params?: unknown[]): Promise<QueryObjectResult<T>>;
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

  queryObject<T>(query: string, params?: unknown[]): Promise<QueryObjectResult<T>> {
    return this.client.queryObject<T>(query, params);
  }
}