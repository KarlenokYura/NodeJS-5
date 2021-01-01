var rpc = require("rpc-websockets").Client;

var client = new rpc("ws://localhost:4000");

client.on("open", () => {
    client.call("square", [3]).
    then((result) => {
        console.log("Square(3) = ", result);
    });
    client.call("square", [3, 5]).
    then((result) => {
        console.log("Square(3, 5) = ", result);
    });
    client.call("sum", [2]).
    then((result) => {
        console.log("Sum(2) = ", result);
    });
    client.call("sum", [2, 4, 6, 8, 10]).
    then((result) => {
        console.log("Sum(2, 4, 6, 8, 10) = ", result);
    });
    client.call("mul", [3]).
    then((result) => {
        console.log("Mul(3) = ", result);
    });
    client.call("mul", [3, 5, 7, 9, 11, 13]).
    then((result) => {
        console.log("Mul(3, 5, 7, 9, 11, 13) = ", result);
    });

    client.login({login: "yura", password: "1605"})
    .then((login) => {
        if (login) {
            client.call("fib", [1]).
            then((result) => {
                console.log("Fib(1) = ", result);
            });
            client.call("fib", [2]).
            then((result) => {
                console.log("Fib(2) = ", result);
            });
            client.call("fib", [7]).
            then((result) => {
                console.log("Fib(7) = ", result);
            });
            client.call("fact", [0]).
            then((result) => {
                console.log("Fib(0) = ", result);
            });
            client.call("fact", [5]).
            then((result) => {
                console.log("Fib(5) = ", result);
            });
            client.call("fact", [10]).
            then((result) => {
                console.log("Fact(10) = ", result);
            });
        }
        else {
            console.log("Login error");
        }
    })
});
client.on("error", (err) => {
    console.log("Error: ", err);
})