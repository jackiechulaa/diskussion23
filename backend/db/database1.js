// db/database.js
const Database = require("better-sqlite3");
const path = require("path");

// Anslut till databasen
const db = new Database(path.join(__dirname, "forum.db"));

// Initiera tabeller
const initDb = () => {
  // Skapa threads-tabell om den inte finns
  db.exec(`
    CREATE TABLE IF NOT EXISTS threads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Skapa replies-tabell om den inte finns
  db.exec(`
    CREATE TABLE IF NOT EXISTS replies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      thread_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (thread_id) REFERENCES threads(id)
    )
  `);

  console.log("Databastabeller har initialiserats");
};

// Initiera databasen direkt när modulen importeras
initDb();

module.exports = db;
