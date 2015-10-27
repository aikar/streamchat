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
client.nick('AikarStream');
client.user('aikarstream', 'Aikar Stream Bot');
stream.on('connect', function() {
	console.log("Connect to IRC");
	setTimeout(function() {
		client.join('#Aikar');
		client.mode('aikarstream', '+B');
	}, 5000);
})

function listenerHandler(service, author, message) {
	console.log("[" + service + "] <" + author + "> " + message);
	client.send('#aikar', "[" + service + "] <" + author + "> " + message);
}

module.exports = {
	register: register
};
