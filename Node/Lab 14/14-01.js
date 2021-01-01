var http = require("http");
var url = require("url");
var oracledb = require("oracledb");

var dbconfig = {
    user: "SYS",
    password: "Pa$$w0rd",
    connectString: "localhost/orcl",
    privilege: oracledb.SYSDBA
};

async function selectTable(req, res, table) {
    var connection;
    try {
      connection = await oracledb.getConnection(dbconfig);
      var result = await connection.execute(
        'SELECT * FROM ' + table);
      res.end(JSON.stringify(result.rows));
    } catch (err) {
      console.error(err);
      res.statusCode = 404;
      res.end(JSON.stringify({error: 'No such faculty with provided id was found'}));
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  async function insertFaculty(req, res, faculty, faculty_name) {
    var connection;
    try {
      connection = await oracledb.getConnection(dbconfig);
      await connection.execute('INSERT INTO faculty(faculty, faculty_name) VALUES(:1, :2)', [faculty, faculty_name]);
      await connection.commit();
      res.end(JSON.stringify({faculty: faculty, faculty_name: faculty_name}));
    } catch (err) {
      console.error(err);
      res.statusCode = 404;
      res.end(JSON.stringify({error: 'No such faculty with provided id was found'}));
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  async function insertPulpit(req, res, pulpit, pulpit_name, faculty) {
    var connection;
    try {
      connection = await oracledb.getConnection(dbconfig);
      await connection.execute('INSERT INTO pulpit(pulpit, pulpit_name, faculty) VALUES(:1, :2, :3)', [pulpit, pulpit_name, faculty]);
      await connection.commit();
      res.end(JSON.stringify({pulpit: pulpit, pulpit_name: pulpit_name, faculty: faculty}));
    } catch (err) {
      console.error(err);
      res.statusCode = 404;
      res.end(JSON.stringify({error: 'No such pulpit with provided id was found'}));
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

async function updateFaculty(req, res, faculty, faculty_name) {
    var connection;
    try {
      connection = await oracledb.getConnection(dbconfig);
      await connection.execute('UPDATE faculty SET faculty_name = :1 WHERE faculty = :2', [faculty_name, faculty]);
      await connection.commit();
      res.end(JSON.stringify({faculty: faculty, faculty_name: faculty_name}));
    } catch (err) {
      console.error(err);
      res.statusCode = 404;
      res.end(JSON.stringify({error: 'No such faculty with provided id was found'}));
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  async function updatePulpit(req, res, pulpit, pulpit_name, faculty) {
    var connection;
    try {
      connection = await oracledb.getConnection(dbconfig);
      await connection.execute('UPDATE pulpit SET pulpit_name = :1, faculty = :2 WHERE pulpit = :3', [pulpit_name, faculty, pulpit]);
      await connection.commit();
      res.end(JSON.stringify({pulpit: pulpit, pulpit_name: pulpit_name, faculty: faculty}));
    } catch (err) {
      console.error(err);
      res.statusCode = 404;
      res.end(JSON.stringify({error: 'No such pulpit with provided id was found'}));
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  async function deleteFaculty(req, res, del) {
    var connection;
    try {
      connection = await oracledb.getConnection(dbconfig);
      await connection.execute('DELETE FROM faculty WHERE faculty = :1', [del]);
      await connection.commit();
      res.end(JSON.stringify({}));
    } catch (err) {
      console.error(err);
      res.statusCode = 404;
      res.end(JSON.stringify({error: 'No such faculty with provided id was found'}));
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  async function deletePulpit(req, res, del) {
    var connection;
    try {
      connection = await oracledb.getConnection(dbconfig);
      await connection.execute('DELETE FROM pulpit WHERE pulpit = :1', [del]);
      await connection.commit();
      res.end(JSON.stringify({}));
    } catch (err) {
      console.error(err);
      res.statusCode = 404;
      res.end(JSON.stringify({error: 'No such pulpit with provided id was found'}));
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

http.createServer(function (req, res) {
    if ((req.method == "GET") && (req.url.toString().split("/")[1] == "api")) {
        if (req.url.toString().split("/")[2] == "faculties") {
            selectTable(req, res, "faculty");
        }
        else if (req.url.toString().split("/")[2] == "pulpits") {
            selectTable(req, res, "pulpit");
        }
    }
    else if ((req.method == "POST") && (url.parse(req.url).pathname == "/api/faculties")) {
        var body = {};
        req.on("data", (chunk) => {
            body = chunk.toString();
            body = eval("(" + body + ")");
            insertFaculty(req, res, body.faculty, body.faculty_name)
        })
    }
    else if ((req.method == "POST") && (url.parse(req.url).pathname == "/api/pulpits")) {
        var body = {};
        req.on("data", (chunk) => {
            body = chunk.toString();
            body = eval("(" + body + ")");
            insertPulpit(req, res, body.pulpit, body.pulpit_name, body.faculty)
        })
    }
    else if ((req.method == "PUT") && (url.parse(req.url).pathname == "/api/faculties")) {
        var body = {};
        req.on("data", (chunk) => {
            body = chunk.toString();
            body = eval("(" + body + ")");
            updateFaculty(req, res, body.faculty, body.faculty_name)
        })
    }
    else if ((req.method == "PUT") && (url.parse(req.url).pathname == "/api/pulpits")) {
        var body = {};
        req.on("data", (chunk) => {
            body = chunk.toString();
            body = eval("(" + body + ")");
            updatePulpit(req, res, body.pulpit, body.pulpit_name, body.faculty)
        })
    }
    else if ((req.method == "DELETE") && (req.url.toString().split("/")[1] == "api") && (req.url.toString().split("/")[2] == "faculties")) {
        var xyz = req.url.toString().split("/")[3];
        deleteFaculty(req, res, xyz);
    }
    else if ((req.method == "DELETE") && (req.url.toString().split("/")[1] == "api") && (req.url.toString().split("/")[2] == "pulpits")) {
        var xyz = req.url.toString().split("/")[3];
        deletePulpit(req, res, xyz);
    }
}).listen(3000);

console.log("Server start on localhost:3000");