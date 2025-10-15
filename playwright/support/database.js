const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
const { ulid } = require('ulid');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

async function insertTestUsers() {
  const client = await pool.connect();
  const BATCH_SIZE = 100;
  const TOTAL_USERS = 2000;
  const PASSWORD = 'pwd123';
  
  // Array para armazenar os dados do CSV
  const csvData = [];
  
  try {
    // Hash da senha uma única vez (reutilizado para todos os usuários)
    const hashedPassword = await bcrypt.hash(PASSWORD, 10);
    
    await client.query('BEGIN');
    
    let insertedCount = 0;
    
    for (let i = 0; i < TOTAL_USERS; i += BATCH_SIZE) {
      const batchSize = Math.min(BATCH_SIZE, TOTAL_USERS - i);
      const values = [];
      const placeholders = [];
      
      for (let j = 0; j < batchSize; j++) {
        const id = ulid();
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const name = `${firstName} ${lastName}`;
        const email = faker.internet.email({ 
          firstName, 
          lastName, 
          provider: 'galb09.dev' 
        }).toLowerCase();
        
        // Adiciona ao CSV
        csvData.push({ name, email, password: PASSWORD });
        
        const offset = j * 4;
        placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`);
        values.push(id, name, email, hashedPassword);
      }
      
      const query = `
        INSERT INTO users (id, name, email, password)
        VALUES ${placeholders.join(', ')}
      `;
      
      await client.query(query, values);
      insertedCount += batchSize;
      console.log(`Progresso: ${insertedCount}/${TOTAL_USERS} usuários inseridos`);
    }
    
    await client.query('COMMIT');
    console.log(`✓ Successfully inserted ${TOTAL_USERS} test users with @galb09.dev domain.`);
    
    // Gerar arquivo CSV
    const csvContent = [
      'name,email,password', // Header
      ...csvData.map(row => `"${row.name}","${row.email}","${row.password}"`)
    ].join('\n');
    
    const csvFilePath = path.join(__dirname, 'test_users.csv');
    fs.writeFileSync(csvFilePath, csvContent, 'utf8');
    console.log(`✓ CSV file generated: ${csvFilePath}`);
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to insert test users:', err);
    throw err;
  } finally {
    client.release();
  }
}

async function cleanUpTestData() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const query = `
      WITH users_to_delete AS (
        SELECT id FROM users WHERE email LIKE '%@galb9.dev'
      ),
      delete_links AS (
        DELETE FROM links
        WHERE user_id IN (SELECT id FROM users_to_delete)
      )
      DELETE FROM users
      WHERE id IN (SELECT id FROM users_to_delete);
    `;
    await client.query(query);
    await client.query('COMMIT');
    console.log('Successfully removed test users and links.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to remove test data:', err);
  } finally {
    client.release();
  }
}

module.exports = { insertTestUsers, cleanUpTestData };