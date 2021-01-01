var http = require("http");
var url = require("url");
var fs = require("fs");

http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname;
    if ((path == "/start") && (req.method == "GET")) {
        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        res.end(fs.readFileSync("./index.html"));
    }
    else {
        res.statusCode = 400;
        res.end();
    }
}).listen(3000);

console.log("Server starts on localhost:3000");

var k = 0;
var ws = require("ws");
var wss = new ws.Server({port: 4000, host: "localhost", path: "/ws"});
wss.on("connection", (websocket) => {
    var n;
    websocket.on("message", message => {
        console.log(`10-01-client: ${message}`);
        n = message;
    });
    setInterval(() => {
        websocket.send(`10-01-server: ${n} -> ${++k}`);
    }, 5000)
})
wss.on("error", (err) => {
    console.log("Error: ", err)
})

console.log("WebSocket server starts on localhost:4000")