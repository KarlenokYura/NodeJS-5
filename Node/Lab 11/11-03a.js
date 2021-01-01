const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:4000/ws');

ws.on('open', ()=>{
    ws.on('ping', data =>{
        console.log(`${data.toString()}`)
    });
    ws.on('message', mess =>{
        console.log(`server: ${mess.toString()}`)
    })
    setInterval(()=>{
        ws.pong('client: pong');
    }, 5000);
});