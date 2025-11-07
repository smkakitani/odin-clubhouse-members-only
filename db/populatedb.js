#! /usr/bin/env node

const { argv } = require("node:process");
const { Client } = require("pg");



const SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  firstName VARCHAR ( 255 ),
  lastName VARCHAR ( 255 ),
  email VARCHAR ( 255 ),
  password VARCHAR ( 255 ),
  isMembership BOOLEAN DEFAULT FALSE,
  isAdmin BOOLEAN DEFAULT FALSE,
  signInDate DATE CURRENT_DATE,
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER REFERENCES users ON DELETE CASCADE,
  title VARCHAR ( 255 ),
  text VARCHAR ( 500 ),
  timestamp TIMESTAMP WITH TIME ZONE CURRENT_TIMESTAMP
);
`;



// Script to connect to DB and populate it
async function main() {
  console.log("seeding...");

  try {
    const client = new Client({
    connectionString: process.argv[2] || process.env.CONNECTION_STRING_LOCAL_DB
  });
    await client.connect();
    await client.query(SQL);
    await client.end();
  
    
    return console.log("done");
  } catch (err) {
    console.error('Connect to db failed, error: ', err);
  }
  
}

main();