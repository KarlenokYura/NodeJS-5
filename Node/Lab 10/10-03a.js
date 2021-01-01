var ws = require("ws");

var param = process.argv[2];

var prefix = typeof param == "undefined" ? "undefined" : param;
var wsc = new ws("ws://localhost:4000/broadcast");

wsc.on("open", () => {
    var k = 0;
    setInterval(() => {
        wsc.send(`client: ${prefix} -> ${++k}`);
    }, 1000);
    wsc.on("message", (message) => {
        if (message.includes(prefix)) {
            console.log(`${message}`);
        }
    })
    setTimeout(() => {
        wsc.close();
        process.exit(0);
    }, 25000);
})
wsc.on("error", (err) => {
    console.log("Error: ", err);
})