/*
 * Copyright (c) (2016) Starlis LLC / Daniel Ennis (Aikar)
 *  
 *  http://aikar.co
 *  http://starlis.com
 *  
 *  @license MIT
 *  
 */
'use strict';
var irc = require('slate-irc');
var log = require('./streamlog').log;

var stream = require('tls').connect({
	port: config.irc_port,
	host: config.irc_host
});

stream.on("error", function(err) {
	console.log("error:", err);
});
stream.on("end", function() {
	process.exit();
});
var client = irc(stream);
if (config.irc_connectpass) {
	client.pass(config.irc_connectpass);
}
client.nick(config.irc_nick);
client.user(config.irc_user, 'Aikar Stream Bot');
var services = {};
var svcMap = {
	lc: 'livecoding',
	hb: 'hitbox',
	tw: 'twitch',
	beam: 'beam',
	dis: 'discord',
	discord: 'discord',
};

client.on('errors', function(err) {
	"use strict";
	console.log("IRC ERROR:", err);
});
stream.on('connect', function () {
	console.log("Connect to IRC");

	client.on('notice', function (e) {
		if (e.message.indexOf("Found your hostname") === -1) {
			console.log("[irc:notice] " + e.message);
		}
	});
	client.on('message', function (e) {
		var userMsg = e.message;
		console.log("[irc:message] <" + e.from + "> " + userMsg)
		if (userMsg.match(/@IRC: /)) {
			return;
		}
		var msg = e.from + "@IRC: ";
		var pattern = /^!(send|all|reply|chat|lc|tw|beam|hb|song)( |$)/;
		var m;
		if ((m = userMsg.match(pattern))) {
			if (m[1] == 'song') {
				sendSongInfo(sendMsg)
			} else {
				userMsg = userMsg.replace(pattern, '');
				if (userMsg) {
					msg += userMsg;

					var svcs = Object.keys(services);
					if (m[1] && svcMap[m[1]]) {
						svcs = [svcMap[m[1]]];
					} else if (e.from != 'Aikar') {
						svcs = [];
					}
					svcs.forEach(function (svc) {
						if (typeof services[svc].send == 'function') {
							services[svc].send(msg);
						}
					});
				}
			}
		}
		require('./discord').sendChat('irc', e.from, userMsg.replace(/\d+(,\d+)?/g, ''));
		log(e.from, 'IRC', userMsg);
	});
	setTimeout(function () {
		if (config.irc_nickpass) {
			client.send("NickServ", "identify " + config.irc_nickpass);
		}
		client.mode(config.irc_nick, '+B');
		client.join(config.irc_chan);
	}, 2000);
});
function registerServices(svcs) {
	services = svcs;
}
function sendMsg(msg) {
	var m = msg.match(/(<.)(.*?)@(.*)/);
	if (m && m.length >= 3) {
		let r = String.fromCharCode(2);
		let test = r + r;
		msg = m[1] + test + m[2] + '@' + m[3];
	}
	if (/you*fat/.test(msg)) {
		return;
	}
	client.send(config.irc_chan, msg);
}

function sendSongInfo(send) {
	var songMeta = require('./music').getSong();
	if (songMeta && songMeta.title) {
		send("[current song] " + songMeta.title + " (by " + songMeta.artist + ") - " + (songMeta.url || ""));
	}
}


module.exports = {
	client: client,
	register: registerServices,
	send: sendMsg
};
