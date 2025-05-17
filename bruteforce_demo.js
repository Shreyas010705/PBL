const mysql = require('mysql');
const bcrypt = require('bcryptjs');

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Shreyas@2005',
  database: 'shreyas'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ MySQL Connection Error:', err.stack);
    return;
  }
  console.log('✅ Connected to MySQL.');
  startBruteForce('user1@example.com', '123abc', 2);
});

// Brute Force Simulator
async function startBruteForce(email, charset, maxLength) {
  let attemptCount = 0;
  const maxAttempts = 3;

  async function tryPassword(passwordGuess) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT password FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
          console.error('🔴 DB Error:', err);
          return resolve(false);
        }

        if (results.length === 0) {
          console.warn('⚠️ User not found.');
          return resolve(false);
        }

        const hashedPassword = results[0].password;
        const isMatch = await bcrypt.compare(passwordGuess, hashedPassword);

        if (isMatch) {
          console.log(`🎉 SUCCESS: Password for ${email} is "${passwordGuess}"`);
          return resolve(true);
        } else {
          console.log(`❌ Attempt #${attemptCount}: "${passwordGuess}" is wrong.`);
          return resolve(false);
        }
      });
    });
  }

  async function generateCombinations(prefix, length) {
    if (length === 0) {
      attemptCount++;
      if (attemptCount > maxAttempts) {
        console.warn('🚫 Maximum attempts reached. Brute force stopped.');
        connection.end();
        return true;
      }
      return await tryPassword(prefix);
    }

    for (let i = 0; i < charset.length; i++) {
      const found = await generateCombinations(prefix + charset[i], length - 1);
      if (found) return true;
    }

    return false;
  }

  console.log(`🚀 Starting brute force on ${email}`);
  for (let length = 1; length <= maxLength; length++) {
    const found = await generateCombinations('', length);
    if (found) return;
  }

  console.log('🛑 Brute force failed or attempts exceeded.');
  connection.end();
}
