var http = require("http");
var url = require("url");
var fs = require("fs");

var server = http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname;
    if ((path == "/connection") && (req.method == "GET")) {
        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        if (typeof url.parse(req.url, true).query.set != "undefined")
        {
            var set = parseInt(url.parse(req.url, true).query.set);
            if (Number.isInteger(set)) {
                server.keepAliveTimeout = set;
            }
        }
        res.end("<h1>KeepAliveTimeout: " + server.keepAliveTimeout + "</h1>")
    }
    else if ((path == "/headers") && (req.method == "GET")) {
        res.setHeader('X-university', 'BSTU');
        res.setHeader('X-faculty', 'IT');
        res.setHeader('X-course', '3');
        res.setHeader('X-group', '4');
        res.setHeader('X-student', 'Yuriy Karlenok');
        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});

        var head = "";
        res.write("<h1>Request headers: </h1>");
        for (key in req.headers) {
            head += "<p>" + key + ": " + req.headers[key];
        }
        res.write(head);
        res.write("<h1>Response headers: </h1>");

        head = "";
        for (key in Object.values(res.getHeaders())) {
            head += "<p>" + Object.values(res.getHeaderNames())[key] + ": " + Object.values(res.getHeaders())[key];
        }
        // var array = Object.values(res.getHeaders())
        res.end(head);
    }
    else if ((req.url.toString().includes("/parameter")) && (req.method == "GET")) {
        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        if (req.url.toString().includes("?")) {
            if ((typeof url.parse(req.url, true).query.x != "undefined") || (typeof url.parse(req.url, true).query.y != "undefined")) {
                var x = parseInt(url.parse(req.url, true).query.x);
                var y = parseInt(url.parse(req.url, true).query.y);
                if ((Number.isInteger(x)) && (Number.isInteger(y))) {
                    res.write("<h1>Сумма: " + (x + y) + "</h1>");
                    res.write("<h1>Разность: " + (x - y) + "</h1>");
                    res.write("<h1>Произведение: " + (x * y) + "</h1>");                    
                    res.end("<h1>Деление: " + (x / y) + "</h1>");
                }
                else {
                    res.end("<h1>Error</h1>");
                }
            }
        }
        else {
            var x = parseInt(req.url.toString().split("/")[2]);
            var y = parseInt(req.url.toString().split("/")[3]);
            if ((Number.isInteger(x)) && (Number.isInteger(y))) {
                res.write("<h1>Сумма: " + (x + y) + "</h1>");
                res.write("<h1>Разность: " + (x - y) + "</h1>");
                res.write("<h1>Произведение: " + (x * y) + "</h1>");                    
                res.end("<h1>Деление: " + (x / y) + "</h1>");
            }
            else {
                res.end("<h1>Error</h1>");
            }
        }
    }
    else if ((path == "/close") && (req.method == "GET")) {
        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        res.end("<h1>Сервер остановится через 10 секунд</h1>");
        timer = setTimeout(()=>{ 
            timeriscreated = false;
            process.exit(0);
            }, 10000 );
    }
    else if ((path == "/socket") && (req.method == "GET")) {
        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        res.write("<h1>IP клиента: " + req.socket.remoteAddress + "</h1>");
        res.write("<h1>Порт клиента: " + req.socket.remotePort + "</h1>");
        res.write("<h1>IP сервера: " + req.socket.localAddress+ "</h1>");                    
        res.end("<h1>Порт сервера: " + req.socket.localPort + "</h1>");
    }
    else if ((path == "/req-data") && (req.method == "GET")) {
        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        let data = [];
        req.on('data', chunk => data.push(chunk));
        req.on('end', () =>
        {
            console.log(data);
            res.end();
        });
    }
    else if ((path == "/resp-status") && (req.method == "GET")) {
        if ((typeof url.parse(req.url, true).query.code != "undefined") || (typeof url.parse(req.url, true).query.mess != "undefined")) {
            var code = parseInt(url.parse(req.url, true).query.code);
            var message = url.parse(req.url, true).query.mess;
            if (Number.isInteger(code)) {
                res.statusCode = code;
                res.statusMessage = message;
                res.writeHead(code, {"Content-Type": "text/html; charset=utf-8"});
                res.end("<h1>" + code + ": " + message + "</h1>");
            }
            else {
                res.end("<h1>Error</h1>");
            }
        }
    }
    else if ((path == "/formparameter") && (req.method == "POST")) {
        var qs = require("querystring");
        var result = "";
        req.on("data", (data) => {
            result += data;
        })
        req.on("end", () => {
            result += "<br/>";
            var o = qs.parse(result);
            for (var key in o) {
                result += `${key} = ${o[key]}<br/>`;
            }
            res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
            res.write("<h1>URL-параметры</h1>");
            res.end(result);
        })
    }
    else if ((path == "/json") && (req.method == "POST")) {
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
    else if ((path == "/xml") && (req.method == "POST")) {
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
    else if ((req.url.toString().includes("/files")) && (req.method == "GET")) {
        if (req.url.toString().split("/").length == 2) {
            fs.readdir("./static", (err, files) => {
                if (err) res.statusCode = 500;
                res.setHeader("X-static-files-count", files.length);
                res.end();
            });
        }
        else if (req.url.toString().split("/").length == 3) {
            var filename = req.url.toString().split("/")[2];
            fs.readFile("./static/" + filename, (err, data) => {
                if (err) {
                    res.statusCode = 404;
                    res.end();
                } 
                else {
                    fs.copyFile("./static/" + filename, "./" + filename, (err) => {
                        if (err) console.log("Ошибка: ", err);
                        else console.log("Файл скопирован");
                    });
                    fs.unlink("./static/" + filename, (err) => {
                        if (err) console.log("Ошибка: ", err);
                        else console.log("Файл скопирован");
                    });
                    res.statusCode = 200;
                    res.end();
                }
            })
        }
        else {
            res.statusCode = 404;
            res.end();
        }
    }
    else if ((path == "/upload") && (req.method == "GET")) {
        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        res.end(fs.readFileSync("./upload.html"));
    }
    else if ((path == "/upload") && (req.method == "POST")) {
        var mp = require("multiparty");
        var result = "";
        var form = new mp.Form({uploadDir: "./static"});
        form.on("field", (name, value) => {
            result += `<br/>---${name} = ${value}`;
        });
        form.on("file", (name, file) => {
            result += `<br/>---${file.originalFilename}: ${file.path}`;
        });
        form.on("error", (err) => {
            console.log("err = ", err);
            res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
            res.write("<h1>Form/Error</h1>");
            res.end();
        });
        form.on("close", () => {
            res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
            res.write("<h1>Form</h1>");
            res.end();
        });
        form.parse(req);
    }
}).listen(3000);

console.log("Server starts on localhost:3000");