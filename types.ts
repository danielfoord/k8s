// types.ts
export interface User {
    id?: number;
    emailAddress: string;
    hashedPassword: string;
}

export interface Config {
    postgresUser: string;
    postgresPassword: string;
    postgresDb: string;
    postgresHost: string;
    port: number;
}
