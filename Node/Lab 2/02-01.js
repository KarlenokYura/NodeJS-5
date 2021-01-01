var http = require("http");
var fs = require("fs");
var url = require("url");

http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname;
    switch (path) {
        case "/html": 
            var index = fs.readFileSync("./index.html");
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(index);
            break;
        case "/png": 
            var png = fs.readFileSync("./image.png");
            res.writeHead(200, {"Content-Type": "image/jpeg"});
            res.end(png);
            break;
        case "/api/name": 
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end("Karlenok Yuriy Andreevich");
            break;
        case "/xmlhttprequest": 
            var xmlhttprequest = fs.readFileSync("./xmlhttprequest.html");
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(xmlhttprequest);
            break;
        case "/fetch": 
            var fetch = fs.readFileSync("./fetch.html");
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(fetch);
            break;
        case "/jquery": 
            var jquery = fs.readFileSync("./jquery.html");
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(jquery);
            break;
    }
}).listen(5000);

console.log("Server starts on localhost:5000");