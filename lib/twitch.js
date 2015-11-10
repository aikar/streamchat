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
				cb(user["display-name"] || user['username'], message);
			});
			client.on("action", function(channel, user, message) {
				cb(user["display-name"] || user['username'], "* " + message);
			});
		},
		sender: function(message) {
			client.say("AikarAdora", message);
		},
		banUser: function(user) {
			//client.ban
		}
	}
})();

