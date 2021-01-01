var ws = require("ws");

var wss = new ws.Server({ port: 4000, host: "localhost", path: "/ws"});

var n = 0;
var count = 0;
var intervaliscreated = false;

wss.on("connection", (websocket) => {
    setInterval(() => {
        wss.clients.forEach(client=>{
            if(client.readyState === ws.OPEN)
                client.ping(`11-03-server: ${++n}`);
        });
    }, 15000);
    if (!intervaliscreated) {
        setInterval(() => {
            wss.clients.forEach(client=>{
                if(client.readyState === ws.OPEN){
                    count++;
                }
            });
            console.log("Clients count: ", count);
            count = 0;
        }, 5000);
        intervaliscreated = true;
    }

})
wss.on("error", (err) => {
    console.log("Error: ", err);
})

console.log("WebSocket server starts on localhost:4000")