const sqlite = require('sqlite3').verbose();
const fs = require('fs/promises');

const logError = err => err && console.error(err);

const DATABASE_PATH = 'data.db';

async function main() {
  await fs.rm(DATABASE_PATH);

  const db = new sqlite.Database(DATABASE_PATH);
  
  db.serialize(() => {
    db.exec(`
    CREATE TABLE Expenses (
      id INTEGER PRIMARY KEY,
      amount REAL,
      category VARCHAR(63),
      date_millis INTEGER
    );
  
    CREATE INDEX Expenses_category_idx ON Expenses(category);
    CREATE INDEX Expenses_date_millis_idx ON Expenses(date_millis);
    
    CREATE TABLE Revenues (
      id INTEGER PRIMARY KEY,
      amount REAL,
      category VARCHAR(63),
      date_millis INTEGER
    );
    
    CREATE INDEX Revenues_category_idx ON Revenues(category);
    CREATE INDEX Revenues_date_millis_idx ON Revenues(date_millis);
    `, logError);
  });
  
  db.close(logError);
}

main();