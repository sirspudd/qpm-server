#!/usr/bin/env node

'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    debug = require('debug')('qpm-server');

var app = express();
var router = new express.Router();

 app.use(bodyParser.json({strict: true }))
    .use(bodyParser.urlencoded({extended: true }))
    .use(router);

router.get('/api/module', function(req, res) {
    var file = req.query.name;
    if (!file) return res.send(400);

    debug('File being requested', file);
    res.sendFile('/tmp/' + file + '.tar');
});

router.post('/api/module', function(req, res) {
    debug('File being requested');
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
