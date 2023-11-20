import pool from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type User = {
 id: number;
 username: string;
 password: string; 
 email: string;
};


class UserService {
  /**
   * Find a user by username.
   */
  findUserByUsername(username: string) {
    return new Promise<User | null>((resolve, reject) => {
      pool.query(
        'SELECT * FROM Users WHERE username = ?',
        [username],
        (error, results: RowDataPacket[]) => {
          if (error) reject(error);
          else resolve(results.length > 0 ? results[0] as User : null);
        }
      );
    });
  }

  /**
   * Register a new user.
   */
  registerUser(username: string, hashedPassword: string) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        'INSERT INTO Users (username, password) VALUES (?, ?)',
        [username, hashedPassword],
        (error, results: ResultSetHeader) => {
          if (error) reject(error);
          else resolve(results.insertId);
        }
      );
    });
  }

  // ... Add other user-related methods as needed
}

const userService = new UserService();
export default userService;