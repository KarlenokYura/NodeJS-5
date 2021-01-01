var rpc = require("rpc-websockets").Client;

var client = new rpc("ws://localhost:4000");

client.on("open", () => {
    client.subscribe("A");
    client.on("A", () => {console.log("Event: A")});
});