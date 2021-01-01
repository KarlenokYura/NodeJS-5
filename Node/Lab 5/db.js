var events = require("events");
var util = require("util");

var db_array = [
    {id: 1, pname: "Yuriy", bday: "2020-07-01"},
    {id: 2, pname: "Elizaveta", bday: "2020-07-01"},
    {id: 3, pname: "Nikita", bday: "2020-07-01"},
    {id: 4, pname: "Alexey", bday: "2020-07-01"}
]

function DB () {
    this.select = () => {
        return db_array;
    };
    this.insert = (data) => {
        db_array.push(data);
    }
    this.update = (data) => {
        var res = db_array.find(obj => {
            return obj.id === parseInt(data.id);
        });
        if (res != undefined) {
            for (var i = db_array.length - 1; i >= 0; --i) {
                if (db_array[i].id == res.id) {                        
                    db_array[i].pname = data.pname;
                    db_array[i].bday = data.bday;
                    return;
                }
            }
        };
        return res;
    }
    this.delete = (id) => {
        var res = db_array.find(obj => { 
            return obj.id === id; 
        });
        if (res != undefined) {
            for (var i = db_array.length - 1; i >= 0; --i) {
                if (db_array[i].id == res.id) {
                    db_array.splice(i, 1);
                    return;
                }
            }
        };
        return res;
    }
    this.commit = () => {
        return "DB is commited";
    };
}

util.inherits(DB, events.EventEmitter);

exports.DB = DB;