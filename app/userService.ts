import { DatabaseClient } from "./db.ts";
import { User } from "./types.ts";

export class UserService {
  constructor(private dbClient: DatabaseClient) { }

  async initialize(): Promise<void> {
    await this.dbClient.connect();
    await this.createUsersTable();
  }

  private async createUsersTable(): Promise<void> {
    // const createTableQuery = `
    //   CREATE TABLE IF NOT EXISTS users (
    //     Id SERIAL PRIMARY KEY,
    //     EmailAddress VARCHAR(100) NOT NULL,
    //     HashedPassword VARCHAR(100) NOT NULL
    //   );
    // `;
    // await this.dbClient.queryObject(createTableQuery);
  }

  async getAllUsers(): Promise<User[]> {
    const result = await this.dbClient.queryObject("SELECT * FROM users");
    return result.rows as User[];
  }

  async createUser(user: Omit<User, "id">): Promise<User> {
    const result = await this.dbClient.queryObject(
      "INSERT INTO users (EmailAddress, HashedPassword) VALUES ($1, $2) RETURNING *",
      [user.emailAddress, user.hashedPassword]
    );
    return result.rows[0] as User;
  }
}
