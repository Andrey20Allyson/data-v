const { handleTimestamp, Database } = require("./p");

function millisFrom(year, month = 0) {
  return new Date(year, month).getTime();
}

async function main() {
  const db = Database('data.db');

  const result = await db.all(`
  SELECT 
    COUNT(*) as num,
    SUM(amount) as amount_sum,
    category
  FROM Expenses
  WHERE date_millis
  BETWEEN ? AND ?
  GROUP BY category
  `, [
    millisFrom(1971),
    millisFrom(2055),
  ]);

  console.log(result);
}

main()
  .then(handleTimestamp());