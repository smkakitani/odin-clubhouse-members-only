const pool = require("./pool");



// User's queries
async function getUserById(userId) {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

    return rows[0];
  } catch (err) {
    console.error('Query getUser error: ', err);
  }
}

async function getUserByEmail(userEmail) {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [userEmail]);

    return rows[0];
  } catch (err) {
    console.error('Query getUser error: ', err);
  }
}

async function addUser({ firstName, lastName, email, password }) {
  try {
    console.log(firstName, lastName, email, password);
    await pool.query("INSERT INTO users (firstName, lastName, email, password) VALUES ($1, $2, $3, $4)", [firstName, lastName, email, password]);
  } catch (err) {
    console.error('Query addUser error: ', err);
  }  
}



// Message's queries
async function addMessage({ timestamp, title, text }) {
  try {
    await pool.query("");
  } catch (err) {
    console.error('Query addMessage error: ', err);
  }
}






module.exports = {
  getUserById,
  getUserByEmail,
  addUser,
  // 
  addMessage,
};