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

export interface ErrorResponse {
  error: string;
  details?: string;
}

export interface CreateUserRequest {
  emailAddress: string;
  hashedPassword: string;
}

