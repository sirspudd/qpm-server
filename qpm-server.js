#!/usr/bin/env node

'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    busboy = require('connect-busboy'),
    debug = require('debug')('qpm-server'),
    fs = require('fs'),
    os = require('os');

console.log(os.tmpdir());
fs.writeFileSync(os.tmpdir()+'/fuck-girish', 'muppet');

var app = express();
var router = new express.Router();

var busboyLimits = {
  highWaterMark: 2 * 1024 * 1024,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
};

var pkgdir = './qpm-server';
fs.mkdirSync(pkgdir)

 app.use(busboy(busboyLimits))
    .use(bodyParser.json({strict: true }))
    .use(bodyParser.urlencoded({extended: true }))
    .use(router);

router.get('/api/module', function(req, res) {
    var file = req.query.name;
    if (!file) return res.send(400);

    debug('File being requested', file);
    res.sendFile(pkgdir + file + '.tar.gz');
});

router.post('/api/publish', function(req, res) {
    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename) {
        debug('File being published ' + filename);
        file.pipe(fs.createWriteStream(pkgdir + filename));
        file.on('end', function() { 
            console.log('Sending back success');
            res.send(200); 
        });
    });
});

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});
