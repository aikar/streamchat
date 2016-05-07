/*
 * Copyright (c) (2016) Starlis LLC / Daniel Ennis (Aikar)
 *
 *  http://aikar.co
 *  http://starlis.com
 *
 *  @license MIT
 *
 */
var xmpp = require('node-xmpp-client');
var Client = require('node-xmpp-client/lib/Client')
var ltx = require('ltx');

(function() {
	"use strict";
	var lcUsername = config.livecoding_user;
	var resource = config.livecoding_resource || "StreamBridge";
	var userJid = lcUsername + "@livecoding.tv";
	var room = lcUsername + "@chat.livecoding.tv";
	/**
	 * @var Client
	 */
	var client = new Client({jid: userJid + "/" + resource, password: config.livecoding_pass});
	var numErrors = 0;
	var readyForMessages = false;
	client.on('online', function () {
		console.log("Livecoding Connected");
		numErrors = 0;
		function sendPresence() {
			client.send( new xmpp.Client.Stanza('presence', {
				to: room + "/" + lcUsername
			}));
		}

		sendPresence();
		setInterval(sendPresence, 1000 * 60);
		setTimeout(function() {
			readyForMessages = true;
		}, 2000);
	});
	client.on("offline", function () {
		console.log("LiveCoding disconnected");
		setTimeout(function () {
			client.restartStream();
		}, 5000*(3000 * numErrors));
	});

	client.on('error', function () {
		console.log("Livecoding Error", arguments);
		setTimeout(function () {
			client.restartStream();
		}, 5000*(3000 * numErrors++));
	});


	var users = [];
	var allUsers = [];
	var isInitlistUsers = false;


	function listen(cb) {
		"use strict";
		client.on('stanza', function(stanza) {
			if (stanza.name == 'message') {
				readMessage(client, stanza, cb);
			} else if (stanza.name == 'presence') {
				updateListUsers(client, stanza);
			} else {
				console.log("unknown", stanza.name);
			}
		});
	}

	function readMessage(client, stanza, cb) {
		var author = stanza.attrs.from.replace(room + '/', '');
		var msg = stanza.children[0].children.toString();
		if (!isInitlistUsers || !readyForMessages || (author == lcUsername && msg.match(/@IRC: /))) {
			return;
		}
		if (stanza.children[2] === undefined || stanza.children[2].attrs.xmlns !== 'urn:xmpp:delay' && stanza.children[2].attrs.xmlns !== 'jabber:x:delay') {
			cb(author, msg);
		}
	}

	function sendMessage(message) {
		client.send(new ltx.Element('message', {to: room, type:"groupchat"}).c('body').t(message));
	}

	function updateListUsers(client, stanza) {
		var user = stanza.attrs.from.replace(room + '/', '');
		var role = undefined;

		if (stanza.children[1] === undefined) {
			console.log(stanza.toString());
			return;
		}

		if (stanza.children[1].children[0] !== undefined) {
			role = stanza.children[1].children[0].attrs.role;
		}
		else {
			role = stanza.children[2].children[0].attrs.role;
		}

		if (user === lcUsername && role === undefined && isInitlistUsers === false) {
			isInitlistUsers = true;
			return;
		}

		if (role === undefined) {
			//out
			var _tmp = [];
			for (let i = 0; i < users.length; i++) {
				if (users[i].name != user) {
					_tmp.push(users[i]);
				}
			}
			users = _tmp;
			//sendMessage("See you soon "+user+"!");
		}
		else {
			//in
			for (let i = 0; i < users.length; i++) {
				if (users[i].name == user) {
					return;
				}
			}

			users.push({name:user, role:role});
			if (isInitlistUsers === true) {
				for (let i = 0; i < users.length; i++) {
					for (var j = 0; j < allUsers.length; j++) {
						if (user == allUsers[j]) {
							if (user != lcUsername) {
								//sendMessage("Welcome back " + user + "!");
							}
							return;
						}
					}
				}
				if (user != lcUsername) {
					//sendMessage("Welcome " + user + "!");
				}
			}
			allUsers.push(user);
		}
	}

	module.exports = {
		listen: listen,
		send: sendMessage
	}

})();

