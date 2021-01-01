function stat(sfn = "./static") {
    this.staticFolder = sfn;
    var fs = require("fs");

    var pathStatic = (fn) => {
        return `${this.staticFolder}${fn}`;
    }

    this.writeHTTP404 = (res) => {
        res.statusCode = 404;
        res.statusMessage = "Resource not found";
        res.end("404 Resource not found");
    }

    var pipeFile = (req, res, headers) => {
        res.writeHead(200, headers);
        fs.createReadStream(pathStatic(req.url)).pipe(res);
    }

    this.isStatic = (ext, fn) => {
        var reg = new RegExp(`^\/.+\.${ext}$`);
        return reg.test(fn);
    }

    this.sendFile = (req, res, headers) => {
        fs.access(pathStatic(req.url), fs.constants.R_OK, err => {
            if (err) this.writeHTTP404(res);
            else pipeFile(req, res, headers);
        })
    }
}

module.exports = (param) => { return new stat(param);}