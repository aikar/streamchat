"use strict";

function register(services) {
	for (let serviceName of Object.keys(services)) {
		var service = services[serviceName];
		service.listen(listenerHandler.bind(service, serviceName));
	}
}
var irc = require('slate-irc');
var stream = require('net').connect({
	port: 6667,
	host: 'irc.spi.gt'
});
var client = irc(stream);
client.nick(config.irc_user);
client.user(config.irc_user, 'Aikar Stream Bot');
stream.on('connect', function() {
	console.log("Connect to IRC");

	client.on('notice', function(e) {
		if (e.message.indexOf("Found your hostname") === -1) {
			console.log("[irc:notice] " + e.message);
		}
	});
	client.on('message', function(e) {
		console.log("[irc:message] <" + e.from + "> " + e.message)
	});
	setTimeout(function() {
		client.join('#Aikar');
		client.send("NickServ", "identify " + config.irc_pass);
		client.mode('aikarstream', '+B');
	}, 6000);
});

function listenerHandler(service, author, message) {
	console.log("[" + service + "] <" + author + "> " + message);
	client.send('#aikar', "<" + author + "@" + service + "> " + message.replace("\n", " "));
}

module.exports = {
	register: register
};
