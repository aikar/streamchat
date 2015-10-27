(function() {
	"use strict";
	var tmi = require('tmi.js');

	var client = new tmi.client({
		channels: ['AikarAdora']
	});
	client.on("connected", function() {
		console.log("connected twitch");
	});
	client.on("disconnected", function() {
		console.log("Disconnected");
		setTimeout(function() {
			client.connect();
		}, 5000)
	});
	client.on("error", function() {
		console.log("error", arguments);
	});
	client.connect();
	module.exports = {
		listen: function(cb) {
			client.on("chat", function(channel, user, message) {
				cb(user["display-name"], message);
			});
		}
	}
})();

