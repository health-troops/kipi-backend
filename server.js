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
      "CREATE TABLE IF NOT EXISTS Healt_Check (id_healthcheck INT NOT NULL AUTO_INCREMENT, id_account INT NOT NULL, asma BOOLEAN NOT NULL, diabetes BOOLEAN NOT NULL, imun BOOLEAN NOT NULL, hamil BOOLEAN NOT NULL, hipertensi BOOLEAN NOT NULL, kardiovas BOOLEAN NOT NULL, kanker BOOLEAN NOT NULL, ginjal BOOLEAN NOT NULL, hati BOOLEAN NOT NULL, paru BOOLEAN NOT NULL, tbc BOOLEAN NOT NULL, lainnya TEXT, PRIMARY KEY (id_healthcheck), FOREIGN KEY (id_account) REFERENCES account(id_account)) ";

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
  let sql ="SELECT * FROM account WHERE email= ?  AND password= ? LIMIT 1";

  conn.query(sql, [req.body.email, md5(req.body.password)], (err, results) => {
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

/*** START CRUD USER */
//show all user
app.get("/api/users", (req, res) => {
  let sql = "SELECT * FROM user";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//show single user
app.get("/api/users/:id", (req, res) => {
  let sql = "SELECT * FROM user WHERE id_account=" + req.params.id;
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//post user
app.post("/api/users", function (req, res) {
  let sql = `INSERT INTO user (id_account, nama, gender, ttl , no_hp, nama_ibu, nama_ayah , provinsi, kota, kec, kel, alamat) VALUES (?)`;

  let values = [req.body.id_account, req.body.nama, req.body.gender, req.body.ttl, req.body.no_hp, req.body.nama_ibu, req.body.nama_ayah, req.body.provinsi, req.body.kota, req.body.kec, req.body.kel, req.body.alamat];

  conn.query(sql, [values], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//update users
app.put("/api/users/:id", (req, res) => {
  let sql ="UPDATE user SET nama='"+req.body.nama +"', gender='" + req.body.gender +"', ttl='"+req.body.ttl+"', no_hp='"+req.body.no_hp+"', nama_ibu='"+req.body.nama_ibu+"', nama_ayah='"+req.body.nama_ayah+"', provinsi='"+req.body.provinsi+"', kota='"+req.body.kota+"', kec='"+req.body.kec+"', kel='"+req.body.kel+"', alamat='"+req.body.alamat+"' WHERE id_account=" + req.params.id;
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//Delete users
app.delete("/api/users/:id", (req, res) => {
  let sql = "DELETE FROM user WHERE id_account=" + req.params.id + "";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});
/*** END CRUD USER */

/*** START CRUP DAILY_KIPI*/
//get all healthcheck
app.get("/api/healthcheck", (req, res) => {
  let sql = "SELECT * FROM Healt_Check";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//get single healtcheck
app.get("/api/healthcheck/:id", (req, res) => {
  let sql = "SELECT * FROM Healt_Check WHERE id_healthcheck=" + req.params.id;
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//post healthceck
app.post("/api/healthcheck", function (req, res) {
  let sql = `INSERT INTO Healt_Check(id_account, asma, diabetes, imun, hamil, hipertensi, kardiovas, kanker, ginjal, hati, paru, tbc, lainnya) VALUES (?)`;

  let values = [req.body.id_account, req.body.asma, req.body.diabetes, req.body.imun, req.body.hamil, req.body.hipertensi, req.body.kardiovas, req.body.kanker, req.body.ginjal, req.body.hati, req.body.paru, req.body.tbc, req.body.lainnya];

  conn.query(sql, [values], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});


//update healtcheack
app.put("/api/healthcheck/:id", (req, res) => {
  let sql = "UPDATE Healt_Check SET id_account='" + req.body.id_account + "', asma='" + req.body.asma +"', diabetes='"+req.body.diabetes+"', imun='"+req.body.imun+"', hamil='"+req.body.hamil+"', hipertensi='"+req.body.hipertensi+"', kardiovas='"+req.body.kardiovas+"', kanker='"+req.body.kanker+"', ginjal='"+req.body.ginjal+"', hati='"+req.body.hati+"', paru='"+req.body.paru+"', tbc='"+req.body.tbc+"', lainnya='"+req.body.lainnya+"' WHERE id_healthcheck=" +req.params.id;
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//Delete healthcheck
app.delete("/api/healthcheck/:id", (req, res) => {
  let sql = "DELETE FROM Healt_Check WHERE id_healthcheck=" + req.params.id + "";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});
/*** END DAILY KIPI */


//Server listening
var port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("Server started on port 4000..." + "DB HOST : " + process.env.DB_HOST);
});