var udp = require("dgram");

var host = "127.0.0.1";
var port = 4000;

var message = 'Hello from client';

var client = udp.createSocket('udp4');
let interval = null;

interval = setInterval(()=>{
    client.send(message, 0, message.length, port, host, function(err, bytes) {
    if (err) throw err;
});
}, 1000);
setTimeout(()=>{
    clearInterval(interval);client.close();
}, 5000);

client.on('message', function (message, remote) {
    console.log('Client DATA: ' + message.toString());
});