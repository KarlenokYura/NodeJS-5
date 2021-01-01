var rpc = require("rpc-websockets").Client;
var async = require("async");

var client = new rpc("ws://localhost:4000");

var handle = (x = client) => async.parallel({
    square_3: (cb) => {
        client.call("square", [3])
        .catch((err) => cb(err, null))
        .then((result) => cb(null, result));
    },
    square_3_5: (cb) => {
        client.call("square", [3, 5])
        .catch((err) => cb(err, null))
        .then((result) => cb(null, result));
    },
    sum_2: (cb) => {
        client.call("sum", [2])
        .catch((err) => cb(err, null))
        .then((result) => cb(null, result));
    },
    sum_2_4_6_8_10: (cb) => {
        client.call("sum", [2, 4, 6, 8, 10])
        .catch((err) => cb(err, null))
        .then((result) => cb(null, result));
    },
    mul_3: (cb) => {
        client.call("mul", [3])
        .catch((err) => cb(err, null))
        .then((result) => cb(null, result));
    },
    mul_3_5_7_9_11_13: (cb) => {
        client.call("mul", [3, 5, 7, 9, 11, 13])
        .catch((err) => cb(err, null))
        .then((result) => cb(null, result));
    },
    fib_1: (cb) => {
        client.login({login: "yura", password: "1605"})
        .then((login) => {
            if (login) {
                client.call("fib", [1])
                .catch((err) => cb(err, null))
                .then((result) => cb(null, result));
            }
            else {
                cb({message1: "login error"}, null);
            }
        })
    },
    fib_2: (cb) => {
        client.login({login: "yura", password: "1605"})
        .then((login) => {
            if (login) {
                client.call("fib", [2])
                .catch((err) => cb(err, null))
                .then((result) => cb(null, result));
            }
            else {
                cb({message1: "login error"}, null);
            }
        })
    },
    fib_7: (cb) => {
        client.login({login: "yura", password: "1605"})
        .then((login) => {
            if (login) {
                client.call("fib", [7])
                .catch((err) => cb(err, null))
                .then((result) => cb(null, result));
            }
            else {
                cb({message1: "login error"}, null);
            }
        })
    },
    fact_0: (cb) => {
        client.login({login: "yura", password: "1605"})
        .then((login) => {
            if (login) {
                client.call("fact", [0])
                .catch((err) => cb(err, null))
                .then((result) => cb(null, result));
            }
            else {
                cb({message1: "login error"}, null);
            }
        })
    },
    fact_5: (cb) => {
        client.login({login: "yura", password: "1605"})
        .then((login) => {
            if (login) {
                client.call("fact", [5])
                .catch((err) => cb(err, null))
                .then((result) => cb(null, result));
            }
            else {
                cb({message1: "login error"}, null);
            }
        })
    },
    fact_10: (cb) => {
        client.login({login: "yura", password: "1605"})
        .then((login) => {
            if (login) {
                client.call("fact", [10])
                .catch((err) => cb(err, null))
                .then((result) => cb(null, result));
            }
            else {
                cb({message1: "login error"}, null);
            }
        })
    },
},
(err, result) => {
    if (err) console.log("Err = ", err);
    else console.log(result);
    client.close();
});

client.on("open", handle);