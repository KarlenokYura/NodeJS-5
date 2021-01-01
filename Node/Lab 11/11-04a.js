var ws = require("ws");

var wss = new ws("ws://localhost:4000/ws");

var name = typeof process.argv[2] == "undefined" ? "undefined" : process.argv[2];

wss.on("open", () => {
    wss.on("message", message => {
        console.log("On message: ", JSON.parse(message));
    })
    var k = 0;
    setInterval(() => {
        wss.send(JSON.stringify({ client: name, timestamp: new Date().toISOString()}));
    }, 5000);
})
