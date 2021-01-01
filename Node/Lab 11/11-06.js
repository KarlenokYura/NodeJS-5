var rpc = require("rpc-websockets").Server;

var server = new rpc({port: 4000, host: "localhost"});

server.event("A");
server.event("B");
server.event("C");

process.stdin.setEncoding("utf-8");
process.stdin.on("readable", () => {

    var command = null;
    while ((command = process.stdin.read()) != null) {
        if (command.trim() == "exit") process.exit(0);
        else if (command.trim() == "A") server.emit("A");
        else if (command.trim() == "B") server.emit("B");
        else if (command.trim() == "C") server.emit("C");
    }
});