var http = require("http");
var url = require("url");
var fs = require("fs");
var database = require("./db");

var db = new database.DB();

db.on('GET', (req, res) => {
    res.end(JSON.stringify(db.select()));
})
db.on('POST', (req, res) => {
    req.on("data", data => {
        var r = JSON.parse(data);
        db.insert(r);
        res.end(JSON.stringify(r));
    })
})
db.on('PUT', (req, res) => {
    req.on("data", data => {
        var r = JSON.parse(data);
        db.update(r);
        res.end(JSON.stringify(r));
    })
})
db.on("DELETE", (req, res) => {
    var url = new URL("http://localhost:5000" + req.url);
    var id = parseInt(url.searchParams.get("id"));
    res.end(JSON.stringify(db.delete(id)));
})

http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname;
    if (path == "/") {
        var html = fs.readFileSync("./index.html");
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(html);
    }
    else if (path == "/api/db") {
        db.emit(req.method, req, res);
    }
}).listen(5000);

console.log("Server starts on localhost:5000");