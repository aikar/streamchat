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
	var Beam = require('node-beam');
	var connection = Beam.Connect({
		username: config.beam_user,
		password: config.beam_pass,
		auth: null, // 2 Factor Authentication code as string, or null if not used
		settings: {
			autoJoinOwnChannel: true
		}
	});
	connection.on('channel:join', function (channel, reconnect) {
		console.log(reconnect ? 'Hitbox Reconnected' : 'Beam Connected');
	});
	module.exports = {
		listen: function (cb) {
			connection.on('chat:message', function(ch, user, message) {
				if (user.username == config.beam_user && message.cleanMessage.match(/@IRC: /)) {
					return;
				}
				cb(user.username, message.cleanMessage);
			});
		},
		send: function(msg) {
			connection.sendMessage(config.beam_user, msg);
		}
	};
})();
