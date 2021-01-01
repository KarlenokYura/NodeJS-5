var udp = require("dgram");

var host = "127.0.0.1";
var port = 4000;

var server = udp.createSocket('udp4');

server.on('listening', function () {
    var address = server.address();
    console.log('UDP-Server ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
    console.log('Server DATA: ' + message.toString());
    var msgResponse="ECHO: " + message.toString();
    server.send(msgResponse, 0, msgResponse.length, remote.port, remote.address, function(err, bytes) {
    if (err) throw err;
    });
});

server.bind(port, host);