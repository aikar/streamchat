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

	var hb = require('hitbox-chat');
	var htmlent = new (require('html-entities')).AllHtmlEntities;
	var client = new hb();

	client.on("disconnect", function() {
		console.log("HitBox disconnected");
		client.open()
	});
	client.on("error", function() {
		console.log("HitBox error");
		client.open()
	});
	module.exports = {
		listen: function(cb) {
			var ready = false;
			client.on('connect', function() {
				console.log("Hitbox Connected");
				var channel = client.joinChannel("aikar");
				channel.on("chat", function(user, msg) {
					if (ready) {
						cb(user, cleanMessage(msg))
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

	function cleanMessage(src) {
		src = src.replace(/<a href="(.+?)" target="_blank">.+?<\/a>/, '$1');
		src = src.replace(/<div class="image"><img src="(.+?)" hbx-width="\d+" hbx-height="\d+"\/><\/div>/, '$1')
		return htmlent.decode(src);
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
