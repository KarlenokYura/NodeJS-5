var http = require("http");

var options = {
    host: "localhost",
    path: "/eight",
    port: 3000,
    method: "GET",
    headers: {
        "Content-Type": 'multipart/form-data'
      }
}
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