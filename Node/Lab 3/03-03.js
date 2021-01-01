var http = require("http");
var url = require("url");
var fs= require("fs");

function fact(k) {
    if (k == 0) {
        return 1
    } else {
        return k * fact(k - 1);
    }
}

http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname;
    var rc = JSON.stringify({k: 0});
    if (path == "/fact") {
        if (typeof url.parse(req.url, true).query.k != "undefined") {
            var k = parseInt(url.parse(req.url, true).query.k);
            if (Number.isInteger(k)) {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify({k:k, fact: fact(k)}));
            }
        }
    }
    else if (path == "/") {
        var index = fs.readFileSync("./index.html");
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(index);
    }
    else {
        res.end(rc);
    }
}).listen(5000);

console.log("Server starts on localhost:5000");