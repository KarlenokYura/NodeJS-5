var http = require("http");

function writeHeaders(req) {
    var head = "";
    for(key in req.headers) {
        head += "<p>" + key + ": " + req.headers[key];
    };
    return head;
}

http.createServer(function (req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write("<p><b>Method: </b>" + req.method +
              "<p><b>Http Version: </b>" + req.httpVersion +
              "<p><b>Url: </b>" + req.url + 
              "<p><b>Headers: </b>" + writeHeaders(req));
    res.end();
}).listen(3000);

console.log("Server starts on localhost:3000");