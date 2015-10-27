"use strict";
global.co = require('co');
global.each = require('co-each');
global.debug = function() {
	console.log(arguments);
};
require('./lib/core').register({
	'hitbox': require("./lib/hitbox"),
	'livecoding': require("./lib/livecoding"),
	'twitch': require("./lib/twitch"),
	'beam': require("./lib/beam")
});

