var tcp = require("net");

var host = "127.0.0.1";
var port = 4000;

tcp.createServer((sock) => {
    console.log("Server connected: " + sock.remoteAddress + ": " + sock.remotePort);

    sock.on("data", (data) => {
        console.log("Server data: ", sock.remoteAddress + ": " + data);
        sock.write("Echo: " + data);
    })
    sock.on("close", (data) => {
        console.log("Server closed: " + sock.remoteAddress + ": " + sock.remotePort)
    })
}).listen(port, host);

console.log("TCP-server starts on " + host + ": " + port)