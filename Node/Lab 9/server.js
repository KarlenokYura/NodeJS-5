var http = require("http");
var url = require("url");
var fs = require("fs");

var server = http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname;
    if ((path == "/first") && (req.method == "GET")) {
        res.statusCode = 200;
        res.end("First");
    }
    else if ((path == "/second") && (req.method == "GET")) {
        res.statusCode = 200;
        res.end(url.parse(req.url, true).query.x + " " + url.parse(req.url, true).query.y);
    }
    else if ((path == "/third") && (req.method == "POST")) {
        res.statusCode = 200;
        res.end(url.parse(req.url, true).query.x + ' ' + url.parse(req.url, true).query.y + ' ' + url.parse(req.url, true).query.s);
    }
    else if ((path == "/four") && (req.method == "POST")) {
        res.statusCode = 200;
        var body = [];
        req.on("data", (chunk) => {
            body = chunk.toString();
            body = JSON.parse(body);
        })
        .on("end", () => {
            res.end(JSON.stringify({
                    _comment: "Response: " + body.comment,
                    x_plus_y: body.x + body.y,
                    concat_s_o: body.s + ": " + body.o.surname + ' ' + body.o.name,
                    length_m: body.m.length
            }));
        })
    }
    else if ((path == "/five") && (req.method == "POST")) {
        res.statusCode = 200;
        var parseString = require("xml2js").parseString;
        var xmlbuilder = require("xmlbuilder");
        var body = [];
        var sum = 0;
        var concat = "";
        var id = ""

        req.on("data", (chunk) => {
            body = chunk.toString();
        })
        .on("end", () => {
            parseString(body, function (err, result) {
                if (err) console.log("Error");
                else {
                    id = result.request.$.id;
                    result.request.x.forEach(elem => {
                        sum += parseInt(elem.$.value);
                    });
                    result.request.m.forEach(elem => {
                        concat += elem.$.value;
                    });
                    var xmldoc = xmlbuilder.create("response").att("id", "33").att("request", id);
                    xmldoc.ele("sum").att("element", "x").att("result", sum);
                    xmldoc.ele("concat").att("element", "m").att("result", concat);
                    res.end(xmldoc.toString());
                }
            })
        })
    }
    else if ((path == "/six") && (req.method == "POST")) {
        res.statusCode = 200;
        var body = fs.readFileSync("./myFile.txt");
        res.end(body);
    }
    else if ((path == "/seven") && (req.method == "POST")) {
        res.statusCode = 200;
        var body = fs.readFileSync("./myFile.png");
        res.end(body);
    }
    else if ((path == "/eight") && (req.method == "GET")) {
        res.statusCode = 200;
        var body = fs.readFileSync("./myFile.txt");
        res.end(body);
    }
}).listen(3000);

console.log("Server starts on localhost:3000");