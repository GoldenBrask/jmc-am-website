const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:Tetedeplay14@127.0.0.1:5432/postgres'
});

async function test() {
    try {
        console.log('Connecting...');
        await client.connect();
        console.log('Connected successfully!');
        try {
            await client.query('CREATE DATABASE jmc_website');
            console.log('Database jmc_website created!');
        } catch (e) {
            console.log('Database creation error (might exist already):', e.message);
        }
        await client.end();
    } catch (err) {
        console.error('Connection error:', err);
    }
}

test();
