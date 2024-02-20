// Função para gerar um número aleatório dentro de um intervalo
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function chooseInArray(array) {
  const idx = randomInRange(0, array.length - 1);

  return array.at(idx);
}

class Category {
  constructor(category, mult = 1) {
    this.category = category;
    this.mult = mult;
  }

  applyInto(entry) {
    if (entry.expense !== undefined) {
      entry.expense = entry.expense * this.mult;
    } else {
      entry.revenue = entry.revenue * this.mult;
    }

    entry.category = this.category;

    return entry;
  }
}

const expenseCategories = [
  new Category('Funcionários'),
  new Category('Energia', .3),
  new Category('Fornecedores', 1.6),
  new Category('Juridica', .6),
  new Category('Contabilidade', .4),
];

const revenueCategories = [
  new Category('Produtos Alimenticios'),
  new Category('Produtos De Carro', 1.1),
  new Category('Produtos Eletrônicos', .5),
  new Category('Serviços Técnicos', .3),
  new Category('Produtos De Estética', 1.9),
];

/**
 * Função para gerar objetos com as características especificadas
 * 
 * @param {number} n
 * @returns {Iterable<{expenses: any[],revenues: any[],}>} 
 */
function* gerarObjetos(n) {
  const maxYear = 2030;
  const minYear = 1986;
  const chunkSize = 2 ** 16;
  const numOfChunks = Math.ceil(n / chunkSize);

  for (let j = 0; j < numOfChunks; j++) {
    const objetos = {
      expenses: [],
      revenues: [],
    };

    for (let i = 0; i < chunkSize; i++) {
      if (i + j * chunkSize >= n) break;
      const entry = {};

      entry.month = Math.floor(Math.random() * 12);
      entry.year = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;

      const isExpense = Math.random() < .45;

      if (isExpense) {
        entry.expense = randomInRange(500, 3000);
        objetos.expenses.push(entry);

        chooseInArray(expenseCategories)
          .applyInto(entry);
      } else {
        entry.revenue = randomInRange(1000, 5000);
        objetos.revenues.push(entry);

        chooseInArray(revenueCategories)
          .applyInto(entry);
      }
    }

    yield objetos;
  }
}

const psqlite = require('./p');

async function main() {
  const db = psqlite.Database('data.db');

  let c = 0;
  // Exemplo de uso
  const N = +process.argv.at(2) ?? 10; // Número de objetos a serem gerados
  if (isNaN(N)) throw TypeError(`N shold be a number`);

  console.log(`Inserindo mais ${N} colunas`);
  for (const { expenses, revenues } of gerarObjetos(N)) {

    console.log(`  Inserindo chunk ${c}...`);

    const expensesStmt = db.prepare(`INSERT INTO Expenses (amount, category, date_millis) VALUES (?, ?, ?)`);
    for (const { expense, category, month, year } of expenses) {
      expensesStmt.run([
        expense,
        category,
        new Date(year, month).getTime(),
      ]);
    }

    const revenuesStmt = db.prepare(`INSERT INTO Revenues (amount, category, date_millis) VALUES (?, ?, ?)`);
    for (const { revenue, category, month, year } of revenues) {
      revenuesStmt.run([
        revenue,
        category,
        new Date(year, month).getTime(),
      ]);
    }

    console.log(`  Esperando fim das operações...`);
    await expensesStmt.finalize();
    await revenuesStmt.finalize();
    console.log(`  Chunk ${c} inserida!`);
    c++;
  }

  await db.close();
}

main().then(psqlite.handleTimestamp());