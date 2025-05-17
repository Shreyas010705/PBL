const mysql = require('mysql');
const bcrypt = require('bcryptjs');

// Create a connection to MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Shreyas@2005',
  database: 'shreyas'
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to the MySQL database.');
});

const users = [
  { email: 'user1@example.com', password: 'password1' },
  { email: 'user2@example.com', password: 'password2' },
  { email: 'user3@example.com', password: 'password3' },
  { email: 'user4@example.com', password: 'password4' },
  { email: 'user5@example.com', password: 'password5' }
];

const insertOrUpdateUsers = async () => {
  let completedQueries = 0;

  const done = () => {
    completedQueries++;
    if (completedQueries === users.length) {
      connection.end((err) => {
        if (err) {
          console.error('Error closing MySQL connection:', err.stack);
        } else {
          console.log('MySQL connection closed.');
        }
      });
    }
  };

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    connection.query('SELECT * FROM users WHERE email = ?', [user.email], (err, results) => {
      if (err) {
        console.error('Error checking user existence:', err.stack);
        done(); // still call done to avoid hanging
        return;
      }

      if (results.length > 0) {
        // User exists, update
        connection.query(
          'UPDATE users SET password = ? WHERE email = ?',
          [hashedPassword, user.email],
          (err) => {
            if (err) {
              console.error(`Error updating ${user.email}:`, err.stack);
            } else {
              console.log(`Updated user: ${user.email}`);
            }
            done();
          }
        );
      } else {
        // New user, insert
        connection.query(
          'INSERT INTO users (email, password) VALUES (?, ?)',
          [user.email, hashedPassword],
          (err) => {
            if (err) {
              console.error(`Error inserting ${user.email}:`, err.stack);
            } else {
              console.log(`Inserted user: ${user.email}`);
            }
            done();
          }
        );
      }
    });
  }
};

// Run it
insertOrUpdateUsers();
