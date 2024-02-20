const sqlite = require('sqlite3').verbose();

function handleVoid(res, rej) {
  return err => {
    if (err) return rej(err);

    res();
  }
}

function handleResult(res, rej) {
  return (err, data) => {
    if (err) return rej(err);

    res(data);
  }
}

/**
 * 
 * @param {import('sqlite3').Statement} stmt 
 */
function promisifyDBStatement(stmt) {
  return {
    _stmt: stmt,
    run(params) {
      return new Promise((res, rej) => stmt.run(params, handleVoid(res, rej)));
    },
    finalize() {
      return new Promise((res, rej) => stmt.finalize(handleVoid(res, rej)));
    }
  }
}

function Database(path) {
  return promisifyDB(new sqlite.Database(path));
}

/**
 * 
 * @param {import('sqlite3').Database} db 
 * @returns 
 */
function promisifyDB(db) {
  return {
    _db: db,
    run(sql, params = []) {
      return new Promise((res, rej) => db.run(sql, params, handleVoid(res, rej)));
    },
    all(sql, params = []) {
      return new Promise((res, rej) => db.all(sql, params, handleResult(res, rej)))
    },
    close() {
      return new Promise((res, rej) => db.close(handleVoid(res, rej)));
    },
    prepare(sql) {
      return promisifyDBStatement(db.prepare(sql))
    }
  }
}

function handleTimestamp() {
  const startTime = Date.now();

  return () => {
    console.log(`Terminou em ${Date.now() - startTime} ms`);
  }
}

module.exports = { Database, handleTimestamp };