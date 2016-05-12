/*
 * Copyright (c) (2016) Starlis LLC / Daniel Ennis (Aikar)
 *
 *  http://aikar.co
 *  http://starlis.com
 *
 *  @license MIT
 *
 */

var express = require('express');
var app = express();
var fs = require('fs');
var log = require('./streamlog');
var spotify = require('./spotify');

app.use(require('cookie-parser')());
function sendFile(file, res) {

	fs.readFile(__dirname + '/../' + file, (err, file) => {
		if (err) {
			console.error(err);
			res.send('Error');
		} else {
			res.send(file.toString());
		}
	});
}
app.use(require('express').static(__dirname + '/../public/'));

app.get('/', (req, res) => {
	if (config.streamjar) {
		res.cookie('streamjar', config.streamjar, {maxAge: 900000});
	}
	sendFile('public/streamchat.html', res);
});
app.get('/data', (req, res) => {
	res.setHeader("Content-Type", "application/json");
	res.send(JSON.stringify({
		chat: log.getLogs(),
		song: spotify.getSong()
	}));
});
app.listen(5555);




