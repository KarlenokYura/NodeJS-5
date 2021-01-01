var http = require("http");
var query = require("querystring");

var params = query.stringify({x:3, y:4});
var path = `/second?${params}`;

var options = {
    host: "localhost",
    path: path,
    port: 3000,
    method: "GET"
};
const req = http.request(options, (res) => {
    console.log("method: ", req.method);
    console.log("response: ", res.statusCode);
    console.log("statusMessage: ", res.statusMessage);

    let data = "";
    res.on("data", (chunk)=>{
        console.log("data: body: ", data += chunk.toString("utf-8"));
    });
    res.on("end", ()=>{console.log("end: body: ", data);});
});

req.on("error", (e)=>{console.log("error: ", e.message);});
req.end();