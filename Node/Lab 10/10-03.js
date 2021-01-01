var ws = require("ws");

var wss = new ws.Server({ port: 4000, host: "localhost", path: "/broadcast"});

wss.on("connection", (websocket) => {
    websocket.on("message", (message) => {
        wss.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
                client.send("server: " + message);
                console.log(message);
            }
        })
    })
})
wss.on("error", (err) => {
    console.log("Error: ", err)
})

console.log("WebSocket server starts on localhost:4000")