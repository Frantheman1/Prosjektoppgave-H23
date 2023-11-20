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
   * Create a User for testing purposes only
   */ 
  createUser(username: string, email: string, passwordHash: string)  {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        'INSERT INTO Users (username, email, passwordHash) VALUES (?, ?, ?)',
        [username, email, passwordHash],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          resolve(results.insertId);
        },
      );
    });
  }
  
}

const userService = new UserService();
export default userService;