const fs = require('fs');
const path = require('path');
const { pool } = require('../src/config/db');

async function runMigrations() {
    console.log('🚀 Starting Database Migrations...');
    try {
        const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        await pool.query(schemaSql);
        console.log('✅ Schema migration completed successfully!');

        const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
        await pool.query(seedSql);
        console.log('✅ Database seed executed successfully!');

        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
}

if (require.main === module) {
    runMigrations();
}

module.exports = runMigrations;
