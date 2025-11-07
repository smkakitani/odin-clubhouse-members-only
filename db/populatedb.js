#! /usr/bin/env node

const { argv } = require("node:process");
const { Client } = require("pg");



const SQL = ``;



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