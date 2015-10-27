"use strict";

function register(services) {
	for (let serviceName of Object.keys(services)) {
		var service = services[serviceName];
		service.listen(listenerHandler.bind(service, serviceName));
	}
}
function listenerHandler(service, author, message) {
	console.log("[" + service + "] <" + author + "> " + message);
}

module.exports = {
	register: register,
};
