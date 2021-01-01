var rpc = require("rpc-websockets").Server;

var server = new rpc({port: 4000, host: "localhost"});

server.register("A", () => console.log("Notify: A")).public();
server.register("B", () => console.log("Notify: B")).public();
server.register("C", () => console.log("Notify: C")).public();