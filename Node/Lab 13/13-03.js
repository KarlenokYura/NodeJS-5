var tcp = require("net");

var host = "127.0.0.1";
var port = 4000;

var sum = 0;

tcp.createServer((sock) => {
    
    console.log("Server connected: " + sock.remoteAddress + ": " + sock.remotePort);

    sock.on("data", (data) => {
        console.log("Server data: ", data, sum);
        sum += data.readInt32LE();
    });
    
    var buf = Buffer.alloc(4);
    var interval = setInterval(() => {
        buf.writeInt32LE(sum, 0);
        sock.write(buf)
    }, 5000);

    sock.on("close", (data) => {
        console.log("Server closed: " + sock.remoteAddress + ": " + sock.remotePort);
        clearInterval(interval);
    })
}).listen(port, host);

console.log("TCP-server starts on " + host + ": " + port)