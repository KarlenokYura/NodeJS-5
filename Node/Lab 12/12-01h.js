var http = require("http");

var options = {
    host: "localhost",
    path: "/backup/20200119230000",
    port: 3000,
    method: "DELETE"
}
const req = http.request(options, (res)=>{
    var data = "";
    res.on("data", (chunk)=>{
        console.log(JSON.parse(data += chunk.toString("utf-8")));
    });
});
    
req.on("error", (err) => {console.log("Error : ", err.message);});
req.end();