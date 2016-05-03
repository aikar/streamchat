/*
 * Copyright (c) (2016) Starlis LLC / Daniel Ennis (Aikar)
 *
 *  http://aikar.co
 *  http://starlis.com
 *
 *  @license MIT
 *
 */

"use strict";
var services = {};
function register(svcs) {
	for (let serviceName of Object.keys(svcs)) {
		var service = svcs[serviceName];
		services[serviceName] = service;
		service.listen(listenerHandler.bind(service, serviceName));
	}
}
var svcMap = {
	lc: 'livecoding',
	hb: 'hitbox',
	tw: 'twitch',
	beam: 'beam'
}
var irc = require('slate-irc');
var stream = require('net').connect({
	port: 6667,
	host: 'irc.spi.gt'
});
var client = irc(stream);
client.nick(config.irc_user);
client.user(config.irc_user, 'Aikar Stream Bot');
stream.on('connect', function() {
	console.log("Connect to IRC");

	client.on('notice', function(e) {
		if (e.message.indexOf("Found your hostname") === -1) {
			console.log("[irc:notice] " + e.message);
		}
	});
	client.on('message', function(e) {
		console.log("[irc:message] <" + e.from + "> " + e.message)
		if (e.message.match(/@IRC: /)) {
			return;
		}
		var msg = e.from + "@IRC: ";
		var pattern = /^!(send|reply|chat|lc|tw|beam|hb) /;
		var m;
		if ((m = e.message.match(pattern))) {
			msg += e.message.replace(pattern, '');

			var svcs = Object.keys(services);
			if (m[1] && svcMap[m[1]]) {
				svcs = [svcMap[m[1]]];
			}
			svcs.forEach(function(svc) {
				if (typeof services[svc].send == 'function') {
					services[svc].send(msg);
				}
			});
		} else {
			msg += e.message;
		}
		streamLog(msg);
	});
	setTimeout(function() {
		client.join('#Aikar');
		client.send("NickServ", "identify " + config.irc_pass);
		client.mode('aikarstream', '+B');
	}, 6000);
});

function listenerHandler(service, author, message) {
	console.log("[" + service + "] <" + author + "> " + message);
	message = message.replace("\n", " ");
	client.send('#aikar', "<" + author + "@" + service + "> " + message);
	streamLog(author +"@" + service +": " + message);
}
var fs = require('fs');
var log = fs.readFileSync('streamchat.txt').toString().split("\n");
trimLog();

function streamLog(str) {
	var mainline = str.substring(0, 58);
	pushLog(mainline);
	if (str.length > 58) {
		str.substring(58).match(/.{0,55}/g).forEach(function(line) {
			if (!line || !line.length) return;
			pushLog("   " + line);
		});
	}
	trimLog();
}
function pushLog(line) {
	if (!line || !line.trim().length) return;
	log.push(line);
}

function trimLog() {
	log.splice(0, log.length - 8);
	fs.writeFile('streamchat.txt', log.join("\n"));
}
module.exports = {
	register: register
};
