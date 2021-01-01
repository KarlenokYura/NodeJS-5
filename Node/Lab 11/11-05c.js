var rpc = require("rpc-websockets").Client;

var client = new rpc("ws://localhost:4000");

client.on("open", () => {
    client.login({login: 'yura', password: '1605'})
      .then(async login =>
      {
        if (login)
        {
            console.log('Result: ' + await client.call('sum',
                [
                    await client.call('square', [3]),
                    await client.call('square', [5, 4]),
                    await client.call('mul', [3, 5, 7, 9, 11, 13])
                ])
                + (await client.call('fib', 7)).reduce((a, b) => a + b, 0)
                * await client.call('mul', [2, 4, 6])
            );
        }
        else
        {
            console.log('login error');
        }
    });
});
client.on("error", (err) => {
    console.log("Error: ", err);
});