var tcp = require("net");

var host = "127.0.0.1";
var port = 4000;

var k = 0;

tcp.createServer((sock) => {
    
    var sum = 0;
    var clientID = ++k;

    console.log(`Client ${clientID} connected`);

    sock.on("data", (data) => {
        console.log(data.readInt32LE() + ` - received from client ${clientID}`);
        sum += data.readInt32LE();
    });
    
    var buf = Buffer.alloc(4);
    var interval = setInterval(() => {
        console.log(`Control sum for a client ${clientID}: ${sum}`);
        buf.writeInt32LE(sum, 0);
        sock.write(buf)
    }, 5000);

    sock.on("close", (data) => {
        console.log("Server closed: " + sock.remoteAddress + ": " + sock.remotePort);
        clearInterval(interval);
    })
}).listen(port, host);

console.log("TCP-server starts on " + host + ": " + port)