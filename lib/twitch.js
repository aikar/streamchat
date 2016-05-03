/*
 * Copyright (c) (2016) Starlis LLC / Daniel Ennis (Aikar)
 *
 *  http://aikar.co
 *  http://starlis.com
 *
 *  @license MIT
 *
 */

(function() {
	"use strict";
	var tmi = require('tmi.js/lib/client');

	var client = new tmi({
		identity: {
			username: config.twitch_user,
			password: config.twitch_pass
		},
		channels: ['AikarAdora']
	});
	client.on("connected", function() {
		console.log("Twitch connected");
	});
	client.on("disconnected", function() {
		console.log("Twitch disconnected");
		setTimeout(function() {
			//client.connect();
		}, 5000)
	});
	client.on("error", function() {
		console.log("error", arguments);
	});
	client.connect();
	module.exports = {
		listen: function(cb) {
			client.on("chat", function(channel, user, message) {
				send(user["display-name"] || user['username'], message);
			});
			client.on("action", function(channel, user, message) {
				send(user["display-name"] || user['username'], "* " + message);
			});
			function send(user, msg) {
				if (user == config.twitch_user && msg.match(/@IRC: /)) {
					return;
				}
				cb(user, msg);
			}
		},
		send: function(message) {
			client.say(config.twitch_user, message);
		},
		banUser: function(user) {
			//client.ban
		}
	}
})();

