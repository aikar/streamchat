(function() {
	"use strict";

	var hb = require('hitbox-chat');
	var client = new hb();

	module.exports = {
		listen: function(cb) {
			var ready = false;
			client.on('connect', function() {
				console.log("Joined");
				var channel = client.joinChannel("aikar");
				channel.on("chat", function(user, msg) {
					if (ready) {
						cb(user, msg)
					}
				});
				channel.on("login", function() {
					setTimeout(function() {
						ready = true;
					}, 3000);
				});
			});
		}
	}
})();
/**
 var request = require("request-promise");
 var Client = require('socket.io-client');
 var serversAPI = "http://api.hitbox.tv/chat/servers?redis=true";

 co(function*() {

		var servers = JSON.parse(yield request(serversAPI));


		var idx = Math.floor(Math.random()*servers.length);
		var endpoint = servers[idx].server_ip;

		var tokenURL = `http://${endpoint}/socket.io/1/`;
		var newVar = yield request(tokenURL);
		var token = newVar.split(/:/)[0];
		var wsURL = `ws://${endpoint}/socket.io/1/websocket/${token}`;

		console.log(wsURL);
		var client = Client.connect(wsURL);

		client.on("connect", debug.bind(null, "connect"));
		client.on("disconnect", debug.bind(null, "disconnect"));
		client.on("error", debug.bind(null, "error"));
	});
 */
