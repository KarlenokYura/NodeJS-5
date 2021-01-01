var http = require("http");

var json = `{
    "id": 2,
    "name": "Test",
    "birth": "2000-05-17",
    "speciality": "DEVI"
  }`;

var options = {
    host: "localhost",
    path: "/",
    port: 3000,
    method: "PUT",
    headers: {
        "Content-Type": "application/json"
      }
}
const req = http.request(options, (res)=>{
    var data = "";
    res.on("data", (chunk)=>{
        console.log(JSON.parse(data += chunk.toString("utf-8")));
    });
});
    
req.on("error", (err) => {console.log("Error: ", err.message);});
req.end(json);