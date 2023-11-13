import pool from '../mysql-pool'; // Update with the correct path

class User {
    static findOne(query: { username: string }, callback: (err: Error | null, user: User | null) => void) {
      // Implement a database query to find a user by the query parameter (e.g., username)
        const querySQL = 'SELECT * FROM users WHERE username = ?';
        executeQuery(querySQL, [query.username], callback);
    }
  
    static findById(id: number, callback: (err: Error | null, user: User | null) => void) {
        // Implement a database query to find a user by ID
        const querySQL = 'SELECT * FROM users WHERE id = ?';
        executeQuery(querySQL, [id], callback);
    }
}
  
function executeQuery(query: string, params: any[], callback: (err: Error | null, user: User | null) => void) {
    pool.query(query, params, (err, results) => {
        if (err) return callback(err, null);
  
        if (Array.isArray(results) && results.length > 0) {
            const userResult = results[0] as User;
            if (userResult && typeof userResult === 'object') {
                return callback(null, userResult);
            }
        }  
        return callback(null, null);
    });
}

{/*TO DO : Gjøre det likt som andre services hehe*/}

export default User;