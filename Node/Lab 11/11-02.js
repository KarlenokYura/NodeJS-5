var ws = require("ws");
var fs = require("fs");

var wss = new ws.Server({ port: 4000, host: "localhost", path: "/ws"})
var k = 0;

wss.on("connection", (websocket) => {
    var duplex = ws.createWebSocketStream(websocket, { encoding: "utf8"});
    var wfile = fs.createWriteStream(`./file${k++}.txt`);
    duplex.pipe(wfile);
})
wss.on("error", (err) => {
    console.log("Error: ", err)
})

console.log("WebSocket server starts on localhost:4000")