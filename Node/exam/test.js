let http = require('http');
let fs = require('fs');

let bound = 'smw60-smw60-smw60';
let body  = `--${bound}\r\n`;
    body += 'Content-Disposition:form-data; name="file"; filename="MyFile.txt"\r\n';
    body += 'Content-Type:text/plain\r\n\r\n';
    body += fs.readFileSync('./MyFile.txt');
    body +=`\r\n--${bound}--\r\n`;

    let options = {
host : 'localhost',
path : '/',
port : 3000,
method: 'POST',
headers:{'content-type': 'multipart/form-data; boundary='+ bound}

    }
const req = http.request(options,(res)=>{
 let data='';
 res.on('data', (chunk)=>{
console.log("http.request: data: body =", data +=chunk.toString('utf8') );

 });
 res.on('end', ()=>{console.log('http.request: end: body =', data);});



});
req.end(body);
