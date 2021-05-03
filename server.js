const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");
require("dotenv").config();
var cors = require("cors");
var uuid = require("uuid");
var md5 = require('md5');
// parse application/json
app.use(bodyParser.json());
app.use(cors());
//create database connection
const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port : process.env.DB_PORT
});
//connect to database
conn.connect((err) => {
  if (!err) {
    console.log("Connected");
    var sqlTableAccount =
      "CREATE TABLE IF NOT EXISTS account (id_account INT NOT NULL AUTO_INCREMENT, email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, PRIMARY KEY(id_account)) ";

    conn.query(sqlTableAccount, function (err, result) {
      var checkRowAccount = "SELECT COUNT(*) as total FROM account";
      conn.query(checkRowAccount, function (errs, results) {
        if (results[0].total == 0) {
          var sqlAccountDummy =
            "INSERT INTO account (id_account, email, password) VALUES ('1','admin@gmail.com',md5('Standar123.')),('2','example@gmail.com',md5('Standar123.'))";
          conn.query(sqlAccountDummy, function (errs, resultst) {
            if (errs) throw errs;
          });
          if (err) throw err;
        }
        if (errs) throw errs;
      });
    });

    var sqlTableUser =
      "CREATE TABLE IF NOT EXISTS user (id_account INT NOT NULL, nama VARCHAR(255) NOT NULL, gender ENUM('laki-laki', 'perempuan') NOT NULL, ttl DATE NOT NULL, no_hp BIGINT NOT NULL, nama_ibu VARCHAR(255) NOT NULL, nama_ayah VARCHAR(255) NOT NULL, provinsi VARCHAR(255) NOT NULL, kota VARCHAR(255) NOT NULL, kec VARCHAR(255) NOT NULL, kel VARCHAR(255) NOT NULL, alamat TEXT NOT NULL, PRIMARY KEY(id_account), FOREIGN KEY (id_account) REFERENCES account(id_account)) ";

      conn.query(sqlTableUser, function (err, result) {
          if (err !== null) {
            console.log(err)
          }
          else{
           
          }
      });

      var sqlTableHealtCheck =
      "CREATE TABLE IF NOT EXISTS Healt_Check (id_account INT NOT NULL, asma BOOLEAN NOT NULL, diabetes BOOLEAN NOT NULL, imun BOOLEAN NOT NULL, hamil BOOLEAN NOT NULL, hipertensi BOOLEAN NOT NULL, kardiovas BOOLEAN NOT NULL, kanker BOOLEAN NOT NULL, ginjal BOOLEAN NOT NULL, hati BOOLEAN NOT NULL, paru BOOLEAN NOT NULL, tbc BOOLEAN NOT NULL, lainnya TEXT, FOREIGN KEY (id_account) REFERENCES account(id_account)) ";

      conn.query(sqlTableHealtCheck, function (err, result) {
          if (err !== null) {
            console.log(err)
          }
          else{
            
          }
      });

      var sqlTableKipiDaily =
      "CREATE TABLE IF NOT EXISTS Kipi_Daily (id_account INT NOT NULL, kejang BOOLEAN NOT NULL, diare BOOLEAN NOT NULL, etc TEXT, FOREIGN KEY (id_account) REFERENCES account(id_account)) ";

      conn.query(sqlTableKipiDaily, function (err, result) {
          if (err !== null) {
            console.log(err)
          }
          else{
            console.log(result)
          }
      });

  } else {
    console.log("Connection Failed");
  }
});

/**** START  CRUD ACCOUNT *****/
//login api

//show all account
app.get("/api/accounts", (req, res) => {
  let sql = "SELECT * FROM account";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//show single account
app.get("/api/accounts/:id", (req, res) => {
  let sql = "SELECT * FROM account WHERE id_account=" + req.params.id;
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//post account
app.post("/api/accounts", function (req, res) {
  let sql = `INSERT INTO account(email, password) VALUES (?)`;

  let values = [req.body.email, md5(req.body.password)];

  conn.query(sql, [values], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});
//update account
app.put("/api/accounts/:id", (req, res) => {
  let sql =
    "UPDATE account SET email='" +
    req.body.email +
    "', password='" +
    md5(req.body.password) +
    "' WHERE id_account=" +
    req.params.id;
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//Delete users
app.delete("/api/accounts/:id", (req, res) => {
  let sql = "DELETE FROM account WHERE id_account=" + req.params.id + "";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//LOGIN USERTS
app.post("/api/login", function (req, res) {
  let sql =
    "SELECT * FROM account WHERE email='" +
    req.body.email +
    "' AND password='" +
    md5(req.body.password) +
    "'";

  let values = [req.body.email, md5(req.body.password)];

  conn.query(sql, [values], (err, results) => {
    if (err) throw err;
    res.send(
      JSON.stringify({
        status: 200,
        error: null,
        response: results,
        token: uuid.v4(),
      })
    );
  });
});

//post account
app.post("/api/register", function (req, res) {
    let sql = `INSERT INTO account(email, password) VALUES (?)`;
  
    let values = [req.body.email, md5(req.body.password)];
  
    conn.query(sql, [values], (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify({ status: 200, error: null, response: results }));
    });
  });
/****  END CRUD ACCOUNT*****/


//Server listening
var port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("Server started on port 4000..." + "DB HOST : " + process.env.DB_HOST);
});