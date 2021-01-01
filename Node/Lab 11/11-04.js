var ws = require("ws");

var wss = new ws.Server({port: 4000, host: "localhost", path: "/ws"});

var n = 0;

wss.on("connection", (websocket) => {
    var client = ""
    websocket.on("message", message => {
        console.log("On message: ", JSON.parse(message));
        client = JSON.parse(message).client
    })
    setInterval(() => {
        websocket.send(JSON.stringify({server: ++n, client: client, timestamp: new Date().toISOString()}))
    }, 5000);
})
wss.on("error", (err) => {
    console.log("Error: ", err);
})

console.log("WebSocket server starts on localhost:4000")