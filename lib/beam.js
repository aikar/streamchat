(function() {
	"use strict";
	var Beam = require('node-beam');
	require('log4js').setGlobalLogLevel('ERROR');
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
				cb(user.username, message.cleanMessage);
			});
		}
	};
})();
