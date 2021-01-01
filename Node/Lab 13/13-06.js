var tcp = require("net");

var host = "127.0.0.1";
var port = 4000;

var client = new tcp.Socket();
var buf = new Buffer.alloc(4);
var interval = null;

var k = Number(process.argv[2]);

client.connect(port, host, () => {
    console.log("Client connected: ", client.remoteAddress + ": " + client.remotePort);
    interval = setInterval(() => {
        client.write((buf.writeInt32LE(k, 0), buf))
    }, 1000);
    setTimeout(() => {
        clearInterval(interval);
        client.end();
    }, 20000);
})

client.on("data", (data) => {
    console.log("Client data: ", data.readInt32LE());
})

client.on("close", () => {
    console.log("Client close");
})