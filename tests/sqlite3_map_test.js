import sql from 'k6/x/sql';
import { check } from 'k6';

export let options = {
    thresholds: {
        // iteration_duration: ["p(95) < 100", "p(90) < 75"],
        checks: ["rate == 1.0"],
    },
};

const db = sql.open("sqlite3", "./test.db");

export function setup() {
  db.exec(`CREATE TABLE IF NOT EXISTS keyvalues (
           id integer PRIMARY KEY AUTOINCREMENT,
           key varchar NOT NULL,
           value varchar);`);
}

export function teardown() {
  db.close();
}

export default function () {
  db.exec("INSERT INTO keyvalues (key, value) VALUES('plugin-name', 'k6-plugin-sql');");

  let res = sql.queryx(db, "SELECT * FROM keyvalues WHERE key = :key;", { "key": 'plugin-name'});
  check(res, {
    'fetch': (r) => r.length >= 0,
  });

//   for (const row of results) {
//     console.log(`key: ${row.key}, value: ${row.value}`);
//   }
}
