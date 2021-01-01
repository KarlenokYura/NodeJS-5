var http = require("http");
var url = require("url");
var fs = require("fs");
var oracledb = require("oracledb");

var dbconfig = {
    user: "SYS",
    password: "Pa$$w0rd",
    connectString: "localhost/orcl",
    privilege: oracledb.SYSDBA
};

async function selectPulpit(req, res) {
    var connection;
    try {
        connection = await oracledb.getConnection(dbconfig);
        var result = await connection.execute('SELECT * FROM pulpit');
        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        var j = [];
        for (let r of result.rows)  {
            var object = {pulpit: r[0], pulpit_name: r[1], faculty: r[2]};
            j.push(object);
        }
        res.end(JSON.stringify(j));
    } catch (err) {
        console.error(err);
        res.statusCode = 404;
        res.end(JSON.stringify({error: 'No such faculty with provided id was found'}));
    }  finally {
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
    var path = url.parse(req.url).pathname;
    if (path == "/") {
        var html = fs.readFileSync("./index.html");
        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        res.end(html);
    }
    else if ((req.method == "GET") && (url.parse(req.url).pathname == "/api/pulpits")) {
        selectPulpit(req, res);
    }
    else if ((req.method == "POST") && (url.parse(req.url).pathname == "/api/pulpits")) {
        var body = {};
        req.on("data", (chunk) => {
            body = chunk.toString();
            body = JSON.parse(body)
            insertPulpit(req, res, body.pulpit, body.pulpit_name, body.faculty)
        })
    }
    else if ((req.method == "PUT") && (url.parse(req.url).pathname == "/api/pulpits")) {
        var body = {};
        req.on("data", (chunk) => {
            body = chunk.toString();
            body = JSON.parse(body)
            updatePulpit(req, res, body.pulpit, body.pulpit_name, body.faculty)
        })
    }
    else if ((req.method == "DELETE") && (req.url.toString().split("/")[1] == "api") && (req.url.toString().split("/")[2] == "pulpits")) {
        var xyz = req.url.toString().split("/")[3];
        deletePulpit(req, res, xyz);
    }
}).listen(3000);

console.log("Server starts on localhost:3000");