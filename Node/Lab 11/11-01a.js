var ws = require("ws");
var fs = require("fs");

var wsc = new ws("ws://localhost:4000/ws");

wsc.on("open", () => {
    var duplex = ws.createWebSocketStream(wsc, {encoding: "utf8"});
    var rfile = fs.createReadStream("./11-01.txt");
    rfile.pipe(duplex);
});