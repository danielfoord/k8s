export interface Config {
  postgresUser: string;
  postgresPassword: string;
  postgresDb: string;
  postgresHost: string;
  port: number;
}


export interface CreateDinosaurRequest {
  name: string;
  description: string;
}
