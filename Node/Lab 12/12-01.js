var http = require("http");
var url = require("url");
var fs = require("fs");

http.createServer(function (req, res) {
    var students = JSON.parse(fs.readFileSync("./StudentList.json"));
    if (req.method == "GET")
    {
        if (req.url.toString().split("/")[1] == "") {
            res.end(JSON.stringify(students));
        }
        else if (req.url.toString().split("/")[1] == "backup") {
            fs.readdir("./backup", ((err, files) => {
                let list = [];
                files.forEach(async file => {
                    list.push({name:(file).toString()});
                });
                res.end(JSON.stringify(list));
            }));
        }
        else {
            var id = req.url.toString().split("/")[1];
            var student = "";
            students.forEach(elem => {
                if (elem.id == id) {
                    student = elem;
                }
            });
            if (student == "") {
                res.statusCode = 404;
                res.end(JSON.stringify({error: 'No such student with provided id was found'}));
            }
            else {
                res.end(JSON.stringify(student));
            }
        }
    }
    else if (req.method == "POST") {
        if (req.url.toString().split("/")[1] == "") {
            var body = {};
            req.on("data", (chunk) => {
                body = chunk.toString();
                body = JSON.parse(body);
                var id = 0;
                students.forEach(elem => {
                    if (elem.id == body.id) {
                        id = elem.id;
                    }
                });
                if (id == 0) {
                    var tempstudents = students;
                    tempstudents.push(body);
                    students = tempstudents;
                    fs.writeFileSync("./StudentList.json", JSON.stringify(students, null, '  '));
                    res.end(JSON.stringify(body));
                }
                else {
                    res.end(JSON.stringify({error: 'Student with this id is used'}));
                }
            })
        }
        else if (req.url.toString().split("/")[1] == "backup") {
            var name = new Date().getFullYear().toString() + (new Date().getMonth() + 1).toString().padStart(2, "0") + new Date().getDate().toString().padStart(2, "0") +
            new Date().getHours().toString().padStart(2, "0") + new Date().getMinutes().toString().padStart(2, "0") + new Date().getSeconds().toString().padStart(2, "0");
            setTimeout(() => {
                fs.copyFileSync("./StudentList.json", "./backup/" + name + "_StudentList.json");
                res.end();
            }, 2000);
        }
    }
    else if (req.method == "PUT") {
        if (req.url.toString().split("/")[1] == "") {
            var body = {};
            req.on("data", (chunk) => {
                body = chunk.toString();
                body = JSON.parse(body);
                var index = 0;
                for (var i = 0; i < students.length; i++) {
                    if (students[i].id == body.id) index = i;
                }
                if (index == 0) {
                    res.end(JSON.stringify({error: 'Student with this id is not found'}));
                }
                else {
                    students[index] = body;
                    fs.writeFileSync("./StudentList.json", JSON.stringify(students, null, '  '));
                    res.end(JSON.stringify(body));
                }
            })
        }
    }
    else if (req.method == "DELETE") {
        if (req.url.toString().split("/").length == 2) {
            var n = parseInt(req.url.toString().split("/")[1]);
            var index = 0;
            for (var i = 0; i < students.length; i++) {
                if (students[i].id == n) index = i;
            }
            if (index == 0) {
                res.end(JSON.stringify({error: 'Student with this id is not used'}));
            }
            else {
                var body = students[index];
                students.splice(index, 1);
                fs.writeFileSync("./StudentList.json", JSON.stringify(students, null, '  '));
                res.end(JSON.stringify(body));
            }
        }
        else if ((req.url.toString().split("/").length == 3) && (req.url.toString().split("/")[1] == "backup")) {
            fs.readdir("./backup", ((err, files) => {
                var olddate = parseInt(req.url.toString().split("/")[2]);
                files.forEach(async file => {
                    if (parseInt(file.substr(0, 14)) > olddate) {
                        fs.unlink("./backup/" + file, (err) => {
                            if (err) console.log("Error: ", err);
                            else console.log("Unlink success");
                        });
                    }
                });
                res.end();
            }));
        }
    }
}).listen(3000)

console.log("Server starts on localhost:3000");