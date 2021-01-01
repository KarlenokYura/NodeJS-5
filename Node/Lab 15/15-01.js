var http = require("http");
var url = require("url");
var mongo = require("mongodb").MongoClient;
var objectID = require("mongodb").ObjectID;

var mongourl = "mongodb+srv://KYA:admin@cluster0-dksm4.mongodb.net/BSTU?retryWrites=true&w=majority";
var client = new mongo(mongourl, { useNewUrlParser: true, useUnifiedTopology: true});

client.connect()
.then(() => {console.log("MongoDB: connect success")})
.catch(() => {console.log("MongoDB: connect failed")});

function selectTable(req, res, table) {
    client.db("BSTU").collection(table, (err, collection) => {
        if (err) console.log("Error: ", err);
        else {
            collection.find({}).toArray()
            .then(elem => res.end(JSON.stringify(elem)))
            .catch(err => {
                res.statusCode = 400;
                res.end(JSON.stringify({error: err}));
            })
        }
    });
}

function insertTable(req, res, table) {
    var body = {};
    req.on("data", (chunk) => {
        body = chunk.toString();
        body = JSON.parse(body); 
        client.db("BSTU").collection(table, (err, collection) => {
            if (err) console.log("Error: ", err);
            else {
                collection.insertOne(body)
                .then(() => res.end(JSON.stringify(body)))
                .catch(err => {
                    res.statusCode = 400;
                    res.end(JSON.stringify({error: err}));
                })
            }
        });
    })
}

http.createServer(function (req, res) {
    if ((req.method == "GET") && (req.url.toString().split("/")[1] == "api")) {
        if (req.url.toString().split("/")[2] == "faculties") {
            selectTable(req, res, "faculty");
        }
        else if (req.url.toString().split("/")[2] == "pulpits") {
            selectTable(req, res, "pulpit")
        }
    }
    else if ((req.method == "POST") && (url.parse(req.url).pathname == "/api/faculties")) {
        insertTable(req, res, "faculty")
    }
    else if ((req.method == "POST") && (url.parse(req.url).pathname == "/api/pulpits")) {
        insertTable(req, res, "pulpit")
    }
    else if ((req.method == "PUT") && (url.parse(req.url).pathname == "/api/faculties")) {
        var body = {};
        req.on("data", (chunk) => {
            body = chunk.toString();
            body = JSON.parse(body); 
            client.db("BSTU").collection("faculty", (err, collection) => {
                if (err) console.log("Error: ", err);
                else {
                    collection.updateOne({_id: objectID(body._id)}, {$set: { faculty: body.faculty, faculty_name: body.faculty_name }})
                    .then(() => res.end(JSON.stringify(body)))
                    .catch(err => {
                        res.statusCode = 400;
                        res.end(JSON.stringify({error: err}));
                    })
                }
            });
        })
    }
    else if ((req.method == "PUT") && (url.parse(req.url).pathname == "/api/pulpits")) {
        var body = {};
        req.on("data", (chunk) => {
            body = chunk.toString();
            body = JSON.parse(body); 
            client.db("BSTU").collection("pulpit", (err, collection) => {
                if (err) console.log("Error: ", err);
                else {
                    collection.updateOne({_id: objectID(body._id)}, {$set: { pulpit: body.pulpit, pulpit_name: body.pulpit_name, faculty: body.faculty }})
                    .then(() => res.end(JSON.stringify(body)))
                    .catch(err => {
                        res.statusCode = 400;
                        res.end(JSON.stringify({error: err}));
                    })
                }
            });
        })
    }
    else if ((req.method == "DELETE") && (req.url.toString().split("/")[1] == "api") && (req.url.toString().split("/")[2] == "faculties")) {
        var xyz = req.url.toString().split("/")[3];
        client.db("BSTU").collection("faculty", (err, collection) => {
            if (err) console.log("Error: ", err);
            else {
                collection.findOneAndDelete({faculty: xyz})
                .then((elem) => res.end(JSON.stringify(elem)))
                .catch(err => {
                    res.statusCode = 400;
                    res.end(JSON.stringify({error: err}));
                })
            }
        });
    }
    else if ((req.method == "DELETE") && (req.url.toString().split("/")[1] == "api") && (req.url.toString().split("/")[2] == "pulpits")) {
        var xyz = req.url.toString().split("/")[3];
        client.db("BSTU").collection("pulpit", (err, collection) => {
            if (err) console.log("Error: ", err);
            else {
                collection.findOneAndDelete({pulpit: xyz})
                .then((elem) => res.end(JSON.stringify(elem)))
                .catch(err => {
                    res.statusCode = 400;
                    res.end(JSON.stringify({error: err}));
                })
            }
        });
    }
}).listen(3000);

console.log("Server start on localhost:3000");