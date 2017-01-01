/*
 * Copyright (c) (2016) Starlis LLC / Daniel Ennis (Aikar)
 *
 *  http://aikar.co
 *  http://starlis.com
 *
 *  @license MIT
 *
 */

"use strict";
var services = {};
var client = require('./irc');
var log = require('./streamlog').log;
var discord = require('./discord');

function register(svcs) {
	for (let serviceName of Object.keys(svcs)) {
		var service = svcs[serviceName];
		services[serviceName] = service;
		service.listen(listenerHandler.bind(service, serviceName));
	}
	client.register(services);
	return services;
}

function listenerHandler(service, author, messageStr) {
	if (!messageStr) {
		return;
	}
	messageStr.split("\n").forEach(message => {
		if (!message || !message.trim()) {
			return;
		}
		console.log("[" + service + "] <" + author + "> " + message);
		message = message.replace("\n", " ");
		client.send("<" + author + "@" + service + "> " + message);
		discord.sendChat(service, author, message);
		log(author, service, message);
	});
}

module.exports = {
	register: register
};
