var http = require("http");
var url = require("url");

function fact(k) {
    if (k == 0) {
        return 1
    } else {
        return k * fact(k - 1);
    }
}

http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname;
    if (path == "/fact") {
        if (typeof url.parse(req.url, true).query.k != "undefined") {
            var k = parseInt(url.parse(req.url, true).query.k);
            if (Number.isInteger(k)) {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify({k:k, fact: fact(k)}));
            }
        }
    }
}).listen(5000);

console.log("Server starts on localhost:5000");