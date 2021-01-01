var http = require("http");
var url = require("url");
var fs = require("fs");
var database = require("./db");

var db = new database.DB();
var queries = 0;
var commits = 0;

db.on('GET', (req, res) => {
    res.end(JSON.stringify(db.select()));
    queries++;
})
db.on('POST', (req, res) => {
    req.on("data", data => {
        var r = JSON.parse(data);
        db.insert(r);
        res.end(JSON.stringify(r));
    });
    queries++;
})
db.on('PUT', (req, res) => {
    req.on("data", data => {
        var r = JSON.parse(data);
        db.update(r);
        res.end(JSON.stringify(r));
    });
    queries++;
})
db.on("DELETE", (req, res) => {
    var url = new URL("http://localhost:5000" + req.url);
    var id = parseInt(url.searchParams.get("id"));
    res.end(JSON.stringify(db.delete(id)));
    queries++;
})
db.on("COMMIT", () => {
    console.log(db.commit());
    commits++;
})

http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname;
    if (path == "/") {
        var html = fs.readFileSync("./index.html");
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(html);
    }
    else if (path == "/api/db") {
        db.emit(req.method, req, res);
    }
    else if (path = "/api/ss") {
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.end(stat);
    }
}).listen(5000);

var timeriscreated = false;
var intervaliscreated = false;
var timer = null;
var interval = null;

var statiscreated = false;
var stattimer = null;
var statinterval = null;
var startdate = null;

var stat = JSON.stringify();

process.stdin.setEncoding("utf-8");
process.stdin.on("readable", () => {

    var command = null;
    while ((command = process.stdin.read()) != null) {
        var state = command.toString().trim().split(" ");
        if (state[0] == "exit") process.exit(0);
        else if (state[0] == "sd") {
            if (timeriscreated) {
                if (state[1] != null) { 
                    clearTimeout(timer);
                    timeriscreated = false; 
                    timer = setTimeout(()=>{ 
                        timeriscreated = false;
                        process.exit(0);
                    }, state[1] * 1000 );
                    timeriscreated = true;
                } 
                else { 
                    clearTimeout(timer);
                    timeriscreated = false; 
                }
            }
            else {
                if (state[1] != null) { 
                    timer = setTimeout(()=>{ 
                    timeriscreated = false;
                    process.exit(0);
                    }, state[1] * 1000 );
                    timeriscreated = true;
                } 
            }
        }
        else if (state[0] == "sc") {
            if (intervaliscreated) {
                if (state[1] == null) { 
                    clearInterval(interval);
                    intervaliscreated = false;
                }
            }
            else {
                if (state[1] != null) { 
                    interval = setInterval(()=>{ 
                        db.emit("COMMIT");
                        intervaliscreated = true;
                    }, state[1] * 1000 );
                    interval.unref();
                }
            }
        }
        else if (state[0] == "ss") {
            if (statiscreated) {
                if (state[1] == null) { 
                    clearInterval(statinterval);
                    clearTimeout(stattimer)
                    statiscreated = false;
                    startdate = null;
                }
            }
            else {
                if (state[1] != null) { 
                    stattimer = setTimeout(()=>{ 
                        clearInterval(statinterval);
                        statiscreated = false;
                        startdate = null;
                    }, state[1] * 1000);
                    statiscreated = true;
                    startdate = ((new Date().getHours()) + ":" + (new Date().getMinutes()) + ":" + (new Date().getSeconds()));

                    statinterval = setInterval(()=>{
                    console.log("Start: " + startdate + ", Finish: " + ((new Date().getHours()) + ":" + (new Date().getMinutes()) + ":" + (new Date().getSeconds())) +
                    ", Queries: " + queries + ", Commits: " + commits);
                    stat = JSON.stringify({start: startdate, finish: ((new Date().getHours()) + ":" + (new Date().getMinutes()) + ":" + (new Date().getSeconds())), queries: queries, commits: commits})
                    }, 5000);
                    statinterval.unref();
                }
            }
        }
    }
});

console.log("Server starts on localhost:5000");