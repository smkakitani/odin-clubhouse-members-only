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

async function updateMembership(userId) {
  try {
    await pool.query("UPDATE users SET ismembership = TRUE WHERE id = $1", [userId]);
  } catch (err) {
    console.error('Query updateMembership error: ', err);
  }
}

async function updateAdmin(userId) {
  try {
    await pool.query("UPDATE users SET ismembership = TRUE, isadmin = TRUE WHERE id = $1", [userId]);
  } catch (err) {
    console.error('Query updateAdmin error: ', err);
  }
}



// Message's queries
async function getAllMessages() {
  try {
    const { rows } = await pool.query("SELECT messages.id, messages.title, messages.text, to_char(messages.timestamp, 'MM-DD-YYYY HH24:MI') AS timestamp, users.firstname AS user_name FROM messages JOIN users ON messages.user_id = users.id");

    return rows;
  } catch (err) {
    console.error('Query getAllMessages error: ', err);
  }
}

async function addMessage({ userId, title, text }) {
  try {
    await pool.query("INSERT INTO messages (user_id, title, text) VALUES ($1, $2, $3)", [userId, title, text]);
  } catch (err) {
    console.error('Query addMessage error: ', err);
  }
}

async function deleteMessageById(messageId) {
  try {
    await pool.query("DELETE FROM messages WHERE id = $1", [messageId]);
  } catch (err) {
    console.error('Query deleteMessageById error: ', err);
  }
}






module.exports = {
  // Users
  getUserById,
  getUserByEmail,
  addUser,
  updateMembership,
  updateAdmin,
  // Messages
  getAllMessages,
  addMessage,
  deleteMessageById,
};