const express = require("express");
const app = express();
const port = 3000;
const config = {
  host: "db",
  user: "root",
  password: "root",
  database: "nodedb"
};
const mysql = require("mysql");
const connection = mysql.createConnection(config);

const create_table_people = `
    create table if not exists people(
        id int primary key auto_increment,
        name varchar(255)
    )
`;

connection.query(create_table_people);

connection.query(`SELECT * FROM people`, function (_, rows) {
  if (rows.length < 2) {
    // This seems pretty bad, but I'm lazy enough to do it xD (could hide it in a button...)
    const insertConnection = mysql.createConnection(config);
    insertConnection.query(
      `INSERT INTO people(name) values ("Wesley"), ("Heitor")`
    );
    insertConnection.end();
  }
});

connection.end();

app.get("/", (req, res) => {
  const fetchConnection = mysql.createConnection(config);

  fetchConnection.query(
    "SELECT name FROM people ORDER BY id desc",
    function (err, rows) {
      if (err) {
        res.send(`Ops, problem connecting to database: ${err}`);
      } else {
        const peopleRender = rows.reduce(
          (str, item) => str + `<li>${item.name}</li>`,
          ""
        );
        res.send(`<h1>Full Cycle Rocks!</h1><ul>${peopleRender}</ul>`);
      }
    }
  );

  fetchConnection.end();
});

app.listen(port, () => {
  console.log("Rodando na porta " + port);
});
