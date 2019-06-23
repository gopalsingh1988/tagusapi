var express = require('express');
var jsonServer = require('json-server');
var singular = require('./singular');
var path = require('path');
var fs = require('fs');
var Busboy = require('busboy');

var server = express();

const uploadPath = path.join(__dirname, 'public/uploads');
const assetsPath = path.join(__dirname, 'public/assets');

server.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

server.use('/assets', express.static(assetsPath));
server.use('/uploads', express.static(uploadPath));

server.post('/upload', function (req, res) {
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        var saveTo = path.join(uploadPath, filename);
        console.log('Uploading: ' + saveTo);
        file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('finish', function () {
        console.log('Upload complete');
        res.sendStatus(200);
    });
    return req.pipe(busboy);
});


server.use(singular);
server.use('/api', jsonServer.router('db.json'));
server.listen(3000);