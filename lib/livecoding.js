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
	function initialize() {
		var xmpp = require('node-xmpp-client');
		var ltx = require('ltx');
		var lcUsername = config.livecoding_user;
		var resource = config.livecoding_resource || "StreamBridge";
		var userJid = lcUsername + "@livecoding.tv";
		var room = lcUsername + "@chat.livecoding.tv";
		var client = new xmpp.Client({jid: userJid + "/" + resource, password: config.livecoding_pass});
		var numErrors = 0;
		client.on('online', function () {
			console.log("Livecoding Connected");
			numErrors = 0;
			function sendPresence() {
				client.send( new xmpp.Stanza('presence', {
					to: room + "/" + lcUsername
				}));
			}

			sendPresence();
			setInterval(sendPresence, 1000 * 60);
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
		return {
			ltx: ltx,
			lcUsername: lcUsername,
			room: room,
			client: client,
			users: users,
			allUsers: allUsers,
			isInitlistUsers: isInitlistUsers
		};
	}
	var __ret = {};
	__ret = initialize(arguments);
	var ltx = __ret.ltx;
	var lcUsername = __ret.lcUsername;
	var room = __ret.room;
	var client = __ret.client;
	var users = __ret.users;
	var allUsers = __ret.allUsers;
	var isInitlistUsers = __ret.isInitlistUsers;

	function listen(cb) {
		"use strict";
		client.on('stanza', function(stanza) {
			if (stanza.name == 'message') {
				readMessage(client, stanza, cb);
			} else if(stanza.name == 'presence') {
				updateListUsers(client, stanza);
			} else {
				console.log("unknown", stanza.name);
				//console.log(stanza.children, stanza.attrs);
			}
		});
	}

	function readMessage(client, stanza, cb) {
		var author = stanza.attrs.from.replace(room + '/', '');
		var msg = stanza.children[0].children.toString();

		if(stanza.children[2] === undefined || stanza.children[2].attrs.xmlns !== 'urn:xmpp:delay' && stanza.children[2].attrs.xmlns !== 'jabber:x:delay') {
			cb(author, msg);
		}
	}

	function sendMessage(message) {
		client.send(new ltx.Element('message', {to: room, type:"groupchat"}).c('body').t(message));
	}

	function updateListUsers(client, stanza) {
		var user = stanza.attrs.from.replace(room + '/', '');
		var role = undefined;

		if(stanza.children[1] === undefined) {
			console.log(stanza.toString());
			return;
		}

		if(stanza.children[1].children[0] !== undefined) {
			role = stanza.children[1].children[0].attrs.role;
		}
		else {
			role = stanza.children[2].children[0].attrs.role;
		}

		if(user === lcUsername && role === undefined && isInitlistUsers === false) {
			isInitlistUsers = true;
			return;
		}

		if(role === undefined) {
			//out
			var _tmp = [];
			for (let i = 0; i < users.length; i++) {
				if(users[i].name != user) {
					_tmp.push(users[i]);
				}
			}
			users = _tmp;
			//sendMessage("See you soon "+user+"!");
		}
		else {
			//in
			for (let i = 0; i < users.length; i++) {
				if(users[i].name == user) {
					return;
				}
			}

			users.push({name:user, role:role});
			if(isInitlistUsers === true) {
				for (let i = 0; i < users.length; i++) {
					for (var j = 0; j < allUsers.length; j++) {
						if(user == allUsers[j]) {
							//sendMessage("Welcome back "+user+"!");
							return;
						}
					}
				}
				//sendMessage("Welcome "+user+"!");
			}
			allUsers.push(user);
		}
	}

	module.exports = {
		listen: listen
	}

})();

