const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");
require("dotenv").config();
var cors = require("cors");
var uuid = require("uuid");
var md5 = require("md5");
// parse application/json
app.use(bodyParser.json());
app.use(cors());
app.use(function (error, request, response, next) {
  console.log("Error handler: ", error);

  // Send an error message to the user.
  response.status(500).json({ error: error.message });

  // Optionally log the request options so you can analyze it later.
});
//create database connection
const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});
//connect to database
conn.connect((err) => {
  if (!err) {
    console.log("Connected");
    var sqlTableAccount = `
      CREATE TABLE IF NOT EXISTS account (
        id_account INT NOT NULL AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        PRIMARY KEY(id_account))`;

    conn.query(sqlTableAccount, function (err, result) {
      var checkRowAccount = "SELECT COUNT(*) as total FROM account";
      conn.query(checkRowAccount, function (errs, results) {
        if (results[0].total == 0) {
          var sqlAccountDummy = `
            INSERT INTO account (id_account, email, password) VALUES
              ('1','admin@gmail.com',md5('Standar123.')),
              ('2','example@gmail.com',md5('Standar123.'))`;
          conn.query(sqlAccountDummy, function (errs, resultst) {
            if (errs) throw errs;
          });
          if (err) throw err;
        }
        if (errs) throw errs;
      });
    });

    var sqlTableUser = `
      CREATE TABLE IF NOT EXISTS user (
        id_account INT NOT NULL,
        nama VARCHAR(255) NOT NULL,
        gender ENUM('laki-laki', 'perempuan') NOT NULL,
        tempat_lahir VARCHAR(50),
        ttl DATE NOT NULL,
        no_hp VARCHAR(20) NOT NULL,
        nama_ibu VARCHAR(255) NOT NULL,
        nama_ayah VARCHAR(255) NOT NULL,
        provinsi VARCHAR(255) NOT NULL,
        kota VARCHAR(255) NOT NULL,
        kec VARCHAR(255) NOT NULL,
        kel VARCHAR(255) NOT NULL,
        alamat TEXT NOT NULL,
        PRIMARY KEY(id_account),
        FOREIGN KEY (id_account) REFERENCES account(id_account))`;

    conn.query(sqlTableUser, function (err, result) {
      if (err !== null) {
        console.log(err);
      } else {
      }
    });

    var sqlTableKomorbid = `
      CREATE TABLE IF NOT EXISTS Komorbid (
        id_account INT NOT NULL,
        hipertensi BOOLEAN NOT NULL,
        diabetes_melitus BOOLEAN NOT NULL,
        gagal_jantung BOOLEAN NOT NULL,
        jantung_koroner BOOLEAN NOT NULL,
        paru_obstruktif_knonis BOOLEAN NOT NULL,
        asma BOOLEAN NOT NULL,
        hati BOOLEAN NOT NULL,
        tbc BOOLEAN NOT NULL,
        autoimun BOOLEAN NOT NULL,
        kanker BOOLEAN NOT NULL,
        hiv BOOLEAN NOT NULL,
        alergi_obat BOOLEAN NOT NULL,
        kelainan_darah BOOLEAN NOT NULL,
        hipertiroid BOOLEAN NOT NULL,
        ginjal BOOLEAN NOT NULL, 
        dermatitis_atopi BOOLEAN NOT NULL,
        reaksi_anafilaksis BOOLEAN NOT NULL,
        urtikaria BOOLEAN NOT NULL,
        alergi_makanan BOOLEAN NOT NULL,
        interstitial_lung BOOLEAN NOT NULL,
        PRIMARY KEY (id_account),
        FOREIGN KEY (id_account) REFERENCES account(id_account))`;

    conn.query(sqlTableKomorbid, function (err, result) {
      if (err !== null) {
        console.log(err);
      } else {
      }
    });

    var sqlTableChecklist = `
      CREATE TABLE IF NOT EXISTS Checklist (
        id INT NOT NULL AUTO_INCREMENT,
        nama_gejala VARCHAR(255) NOT NULL,
        penanganan TEXT NOT NULL,
        PRIMARY KEY (id))`;

    conn.query(sqlTableChecklist, function (err, result) {
      if (err !== null) {
        console.log(err);
      } else {
      }
    });

    var sqlTableFormChecklist = `
      CREATE TABLE IF NOT EXISTS Form_Checklist (
        id_form INT NOT NULL,
        id_checklist INT NOT NULL,
        FOREIGN KEY (id_form) REFERENCES Form_Kipi_Daily(id),
        FOREIGN KEY (id_checklist) REFERENCES Checklist(id))`;

    conn.query(sqlTableFormChecklist, function (err, result) {
      if (err !== null) {
        console.log(err);
      } else {
      }
    });

    var sqlTableKipiDaily = `
      CREATE TABLE IF NOT EXISTS Form_Kipi_Daily (
        id INT NOT NULL AUTO_INCREMENT,
        id_account INT NOT NULL,
        tanggal DATE,
        lainnya TEXT,
        diagnosis TEXT,
        PredictionClass0 FLOAT,
        PredictionClass1 FLOAT,
        PredictionClass2 FLOAT,
        Recommendation TEXT,
        PRIMARY KEY(id),
        FOREIGN KEY (id_account) REFERENCES account(id_account))`;

    conn.query(sqlTableKipiDaily, function (err, result) {
      if (err !== null) {
        console.log(err);
      } else {
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
  let sql = "SELECT * FROM account WHERE id_account = ?";
  let query = conn.query(sql, [req.params.id], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//update account
app.put("/api/accounts/:id", (req, res, next) => {
  try {
    let sql =
      "UPDATE account SET email = ? , password = ? WHERE id_account = ?";
    let query = conn.query(
      sql,
      [req.body.email, md5(req.body.password), req.params.id],
      (err, results) => {
        res.send(JSON.stringify({ error: err, response: results }));
      }
    );
  } catch (error) {
    return error.message;
  }
});

//Delete users
app.delete("/api/accounts/:id", (req, res) => {
  let sql = "DELETE FROM account WHERE id_account = ?";
  let query = conn.query(sql, [req.params.id], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//LOGIN USERTS
app.post("/api/login", function (req, res) {
  let sql = "SELECT * FROM account WHERE email = ?  AND password = ? LIMIT 1";

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
  try {
    let sql = `INSERT INTO account(email, password) VALUES (?)`;

    let values = [req.body.email, md5(req.body.password)];

    conn.query(sql, [values], (err, results) => {
      res.send(JSON.stringify({ error: err, response: results }));
    });
  } catch (error) {
    return error.message;
  }
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
  let sql = "SELECT * FROM user WHERE id_account = ?";
  let query = conn.query(sql, [req.params.id], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//post user
app.post("/api/users", function (req, res) {
  try {
    let sql = `INSERT INTO user (id_account, nama, gender, tempat_lahir, ttl , no_hp, nama_ibu, nama_ayah , provinsi, kota, kec, kel, alamat) VALUES (?)`;

    let values = [
      req.body.id_account,
      req.body.nama,
      req.body.gender,
      req.body.tempat_lahir,
      req.body.ttl,
      req.body.no_hp,
      req.body.nama_ibu,
      req.body.nama_ayah,
      req.body.provinsi,
      req.body.kota,
      req.body.kec,
      req.body.kel,
      req.body.alamat,
    ];

    conn.query(sql, [values], (err, results) => {
      res.send(JSON.stringify({ error: err, response: results }));
    });
  } catch (error) {
    return error.message;
  }
});

//update users
app.put("/api/users/:id", async (req, res) => {
  try {
    let sql =
      "UPDATE user SET nama = ? , gender = ?, tempat_lahir=?, ttl = ?, no_hp = ? , nama_ibu = ?, nama_ayah = ? , provinsi = ?, kota = ?, kec = ? , kel = ? , alamat = ? WHERE id_account = ?";

    let query = conn.query(
      sql,
      [
        req.body.nama,
        req.body.gender,
        req.body.tempat_lahir,
        req.body.ttl,
        req.body.no_hp,
        req.body.nama_ibu,
        req.body.nama_ayah,
        req.body.provinsi,
        req.body.kota,
        req.body.kec,
        req.body.kel,
        req.body.alamat,
        req.params.id,
      ],
      (err, results) => {
        res.send(JSON.stringify({ error: err, response: results }));
      }
    );
  } catch (error) {
    return error.message;
  }
});

//Delete users
app.delete("/api/users/:id", (req, res) => {
  let sql = "DELETE FROM user WHERE id_account = ?";
  let query = conn.query(sql, [req.params.id], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});
/*** END CRUD USER */

/*** START CRUP komorbid*/
//get all komorbid
app.get("/api/komorbid", (req, res) => {
  let sql = "SELECT * FROM Komorbid";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//get single healtcheck
app.get("/api/komorbid/:id", (req, res) => {
  let sql = "SELECT * FROM Komorbid WHERE id_account = ?";
  let query = conn.query(sql, [req.params.id], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//post healthceck
app.post("/api/komorbid", function (req, res) {
  try {
    let sql = `INSERT INTO Komorbid (id_account, hipertensi, diabetes_melitus, gagal_jantung, jantung_koroner, paru_obstruktif_knonis, asma, hati, tbc, autoimun, kanker, hiv, alergi_obat, kelainan_darah, hipertiroid, ginjal, dermatitis_atopi, reaksi_anafilaksis, urtikaria, alergi_makanan, interstitial_lung) VALUES (?)`;

    let values = [
      req.body.id_account,
      req.body.hipertensi,
      req.body.diabetes_melitus,
      req.body.gagal_jantung,
      req.body.jantung_koroner,
      req.body.paru_obstruktif_knonis,
      req.body.asma,
      req.body.hati,
      req.body.tbc,
      req.body.autoimun,
      req.body.kanker,
      req.body.hiv,
      req.body.alergi_obat,
      req.body.kelainan_darah,
      req.body.hipertiroid,
      req.body.ginjal,
      req.body.dermatitis_atopi,
      req.body.reaksi_anafilaksis,
      req.body.urtikaria,
      req.body.alergi_makanan,
      req.body.interstitial_lung,
    ];

    conn.query(sql, [values], (err, results) => {
      res.send(JSON.stringify({ error: err, response: results }));
    });
  } catch (error) {
    return error.message;
  }
});

//update komorbid
app.put("/api/komorbid/:id", (req, res) => {
  try {
    let sql =
      "UPDATE Komorbid SET hipertensi = ? , diabetes_melitus = ? , gagal_jantung = ? , jantung_koroner = ? , paru_obstruktif_knonis = ? , asma = ? , hati = ? , tbc = ? , autoimun = ? , kanker = ? , hiv = ? , alergi_obat = ? , kelainan_darah = ? , hipertiroid = ? , ginjal = ? , dermatitis_atopi = ? , reaksi_anafilaksis = ? , urtikaria = ? , alergi_makanan = ? , interstitial_lung = ? WHERE id_account = ?";
    let query = conn.query(
      sql,
      [
      req.body.hipertensi,
      req.body.diabetes_melitus,
      req.body.gagal_jantung,
      req.body.jantung_koroner,
      req.body.paru_obstruktif_knonis,
      req.body.asma,
      req.body.hati,
      req.body.tbc,
      req.body.autoimun,
      req.body.kanker,
      req.body.hiv,
      req.body.alergi_obat,
      req.body.kelainan_darah,
      req.body.hipertiroid,
      req.body.ginjal,
      req.body.dermatitis_atopi,
      req.body.reaksi_anafilaksis,
      req.body.urtikaria,
      req.body.alergi_makanan,
      req.body.interstitial_lung,
      req.params.id,
      ],
      (err, results) => {
        res.send(JSON.stringify({ error: err, response: results }));
      }
    );
  } catch (error) {
    return error.message;
  }
});

//Delete komorbid
app.delete("/api/komorbid/:id", (req, res) => {
  let sql = "DELETE FROM Komorbid WHERE id_account = ?";
  let query = conn.query(sql, [req.params.id], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});
/*** END HEALTH CHECK */

/**** START  CRUD KIPI DAILY *****/
//get all kipi daily
app.get("/api/formkipidaily", (req, res) => {
  let sql = "SELECT * FROM Form_Kipi_Daily";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//get single kipi daily
app.get("/api/formkipidaily/:id", (req, res) => {
  let sql = "SELECT * FROM Form_Kipi_Daily WHERE id = ?";
  let query = conn.query(sql, [req.params.id], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//post kipi daily
app.post("/api/formkipidaily", function (req, res) {
  try {
    let sql = `INSERT INTO Form_Kipi_Daily (id, id_account, tanggal, lainnya, diagnosis, PredictionClass0, PredictionClass1, PredictionClass2, Recommendation) VALUES (?)`;

    let values = [
      req.body.id,
      req.body.id_account,
      req.body.tanggal,
      req.body.lainnya,
      req.body.diagnosis,
      req.body.PredictionClass0,
      req.body.PredictionClass1,
      req.body.PredictionClass2,
      req.body.Recommendation
    ];

    conn.query(sql, [values], (err, results) => {
      res.send(JSON.stringify({ error: err, response: results }));
    });
  } catch (error) {
    return error.message;
  }
});

//update kipi daily
app.put("/api/formkipidaily/:id", (req, res) => {
  try {
    let sql =
      "UPDATE Form_Kipi_Daily SET id_account = ? , tanggal = ? , lainnya = ? , diagnosis = ? , PredictionClass0 = ? , PredictionClass1 = ? ,  PredictionClass2 = ?, Recommendation = ?  WHERE id = ?";
    let query = conn.query(
      sql,
      [
        req.body.id_account,
        req.body.tanggal,
        req.body.lainnya,
        req.body.diagnosis,
        req.body.PredictionClass0,
        req.body.PredictionClass1,
        req.body.PredictionClass2,
        req.body.Recommendation,
        req.params.id,
      ],
      (err, results) => {
        res.send(JSON.stringify({ error: err, response: results }));
      }
    );
  } catch (error) {
    return error.message;
  }
});

//Delete kipi daily
app.delete("/api/formkipidaily/:id", (req, res) => {
  let sql = "DELETE FROM Form_Kipi_Daily WHERE id = ?";
  let query = conn.query(sql, [req.params.id], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});
/**** END CRUD KIPI DAILY */

/**** START  CRUD FORM CHECKLIST *****/
//get all form checklist
app.get("/api/formchecklist", (req, res) => {
  let sql = "SELECT * FROM Form_Checklist";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//get single form checklist
app.get("/api/formchecklist/:id", (req, res) => {
  let sql = "SELECT * FROM Form_Checklist WHERE id_form = ?";
  let query = conn.query(sql, [req.params.id], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//post form checklist
app.post("/api/formchecklist", function (req, res) {
  try {
    let sql = `INSERT INTO Form_Checklist (id_form, id_checklist) VALUES (?)`;

    let values = [
      req.body.id_form,
      req.body.id_checklist
    ];

    conn.query(sql, [values], (err, results) => {
      res.send(JSON.stringify({ error: err, response: results }));
    });
  } catch (error) {
    return error.message;
  }
});

//update form checklist
app.put("/api/formchecklist/:id", (req, res) => {
  try {
    let sql =
      "UPDATE Form_Checklist SET id_checklist = ? WHERE id_form = ?";
    let query = conn.query(
      sql,
      [
        req.body.id_checklist,
        req.params.id,
      ],
      (err, results) => {
        res.send(JSON.stringify({ error: err, response: results }));
      }
    );
  } catch (error) {
    return error.message;
  }
});

//Delete form checklist
app.delete("/api/formchecklist/:id", (req, res) => {
  let sql = "DELETE FROM Form_Checklist WHERE id_form = ?";
  let query = conn.query(sql, [req.params.id], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});
/**** END CRUD FORM CHECKLIST */

/**** START  CRUD CHECKLIST *****/
//get all checklist
app.get("/api/checklists", (req, res) => {
  let sql = "SELECT * FROM Checklist";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//get single checklist
app.get("/api/checklists/:id", (req, res) => {
  let sql = "SELECT * FROM Checklist WHERE id = ?";
  let query = conn.query(sql, [req.params.id], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//post checklist
app.post("/api/checklists", function (req, res) {
  try {
    let sql = `INSERT INTO Checklist (id, nama_gejala, penanganan) VALUES (?)`;

    let values = [
      req.body.id,
      req.body.nama_gejala,
      req.body.penanganan
    ];

    conn.query(sql, [values], (err, results) => {
      res.send(JSON.stringify({ error: err, response: results }));
    });
  } catch (error) {
    return error.message;
  }
});

//update checklist
app.put("/api/checklists/:id", (req, res) => {
  try {
    let sql =
      "UPDATE Checklist SET nama_gejala = ?, penanganan = ? WHERE id = ?";
    let query = conn.query(
      sql,
      [
        req.body.nama_gejala,
        req.body.penanganan,
        req.params.id,
      ],
      (err, results) => {
        res.send(JSON.stringify({ error: err, response: results }));
      }
    );
  } catch (error) {
    return error.message;
  }
});

//Delete checklist
app.delete("/api/checklists/:id", (req, res) => {
  let sql = "DELETE FROM Checklist WHERE id = ?";
  let query = conn.query(sql, [req.params.id], (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});
/**** END CRUD CHECKLIST */

//test ci cd
app.get("/api/test", (req, res) => {
  let sql = "SELECT * FROM account";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});


//Server listening
var port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(
    "Server started on port 4000..." + "DB HOST : " + process.env.DB_HOST
  );
});

