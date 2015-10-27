(function() {
	"use strict";
	var ini = require('ini');
	var config = ini.parse(require('fs').readFileSync('/home/aikar/livecoding.ini').toString());
	var xmpp = require('node-bosh-xmpp-client');
	var ltx = require('ltx');
	var lcUsername = config.user;
	var resource = config.resource || "StreamBridge";
	var userJid = lcUsername + "@livecoding.tv";
	var room = lcUsername + "@chat.livecoding.tv";
	var client = new xmpp.Client(userJid + "/" + resource, config.pass, "https://www.livecoding.tv/chat/http-bind");

	client.on('online', function() {
		client.send(xmpp.$pres({
			to: room + "/" + lcUsername
		}));
	});

	client.on('error', function() {
		console.log(arguments);
	});


	var users = [];
	var allUsers = [];
	var isInitlistUsers = false;

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

