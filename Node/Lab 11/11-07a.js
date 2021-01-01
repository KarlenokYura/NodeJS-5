var rpc = require("rpc-websockets").Client;

var client = new rpc("ws://localhost:4000");

client.on("open", () => {
    process.stdin.setEncoding("utf-8");
    process.stdin.on("readable", () => {

    var command = null;
    while ((command = process.stdin.read()) != null) {
        if (command.trim() == "exit") process.exit(0);
        else if (command.trim() == "A") client.notify("A");
        else if (command.trim() == "B") client.notify("B");
        else if (command.trim() == "C") client.notify("C");
    }
});
})