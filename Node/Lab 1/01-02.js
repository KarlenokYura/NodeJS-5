var http = require("http");

http.createServer(function (req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write("<h1>Hello world</h1>");
    res.end();
}).listen(3000);

console.log("Server starts on localhost:3000");