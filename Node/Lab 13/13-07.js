var tcp = require("net");

var host = "127.0.0.1";
var port4k = 4000;
var port5k = 5000;

var handler = (n) => {
    return (sock) => {
    
        console.log("Server connected: " + sock.remoteAddress + ": " + sock.remotePort);
    
        sock.on("data", (data) => {
            console.log(`DATA ${n} : ` + data.readInt32LE())
            sock.write(`ECHO ${n} : ` + data.readInt32LE());
        });

        sock.on("close", (data) => {
            console.log("Server closed: " + sock.remoteAddress + ": " + sock.remotePort);
        })
    }
}

tcp.createServer(handler(port4k)).listen(port4k, host);
console.log("TCP-server starts on " + host + ": " + port4k);

tcp.createServer(handler(port5k)).listen(port5k, host);
console.log("TCP-server starts on " + host + ": " + port5k)