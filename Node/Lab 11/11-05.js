var rpc = require("rpc-websockets").Server;

var server = new rpc({port: 4000, host: "localhost"});

server.setAuth((l) => {
    return (l.login == "yura" && l.password == "1605")
})

server.register("square", (params) => {
    return square(params);
}).public();
server.register("sum", (params) => {
    return sum(params);
}).public();
server.register("mul", (params) => {
    return mul(params);
}).public();
server.register("fib", (params) => {
    return fib(params);
}).protected();
server.register("fact", (params) => {
    return fact(params);
}).protected();

console.log("WebSocket server starts on localhost:4000")

function square(params) {
    if (params.length == 1) {
        return (Math.PI * params[0] * params[0]);
    }
    else if (params.length == 2) {
        return (params[0] * params[1]);
    }
}

function sum(params) {
    var sum = 0;
    params.forEach(elem => {
        sum += elem;
    });
    return sum;
}

function mul(params) {
    var mul = 1;
    params.forEach(elem => {
        mul *= elem;
    });
    return mul;
}

function fib(param) {
    var elems = [];
    for(var i = 1; i <= param; i++) {
        elems.push(fibn(i));
    }
    return elems;
}

function fibn(param) {
    return (param < 2) ? param : (fibn(param-1) + fibn(param-2));
}

function fact(param) {
    if (param == 0) {
        return 1;
    }
    else {
        return param * fact(param - 1);
    }
}