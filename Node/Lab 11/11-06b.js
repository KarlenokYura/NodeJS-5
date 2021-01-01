var rpc = require("rpc-websockets").Client;

var client = new rpc("ws://localhost:4000");

client.on("open", () => {
    client.subscribe("B");
    client.on("B", () => {console.log("Event: B")});
});