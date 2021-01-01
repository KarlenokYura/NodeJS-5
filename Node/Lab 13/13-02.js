var tcp = require("net");

var host = "127.0.0.1";
var port = 4000;

var client = new tcp.Socket();

client.connect(port, host, () => {
    console.log("Client connected: ", client.remoteAddress + ": " + client.remotePort)
})

client.write("Hello, server");

client.on("data", (data) => {
    console.log(data.toString());
    client.destroy();
})

client.on("close", () => {
    console.log("Client close");
})