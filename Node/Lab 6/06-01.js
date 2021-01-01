//npm list
//npm ls
//npm la
//npm ll
//Чтобы посмотреть пакеты
//-g - глобальные пакеты

//npm install [пакет] - установка пакета
//-g - установка глобально

//npm uninstall [пакет] - удаление пакета

//npm view [пакет] - информация о пакете

//npm search [пакет] - поиск пакета

var http = require("http");
var url = require("url");
var sendmail = require("sendmail") ({silent: true});

http.createServer(function (req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
    var path = url.parse(req.url).pathname;
    if ((path == "/") && (req.method == "GET")) {
        sendmail({
            from: "karlenok.yuriy@gmail.com",
            to: "karlenok.yuriy@gmail.com",
            subject: "Sendmail example",
            html: "<h1>Hello, Yuriy</h1>"
        })
        res.end("<h1>Letter was sent</h1><h2>Please, check your email spam</h2>");
    }
}).listen(3000);

console.log("Server starts on localhost:3000");
