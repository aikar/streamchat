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
global.co = require('co');
global.each = require('co-each');
global.config = require('ini').parse(require('fs').readFileSync(__dirname + '/config.ini').toString());

global.debug = function() {
	console.log(arguments);
};
global.services = require('./lib/core').register({
	'hitbox': require("./lib/hitbox"),
	'livecoding': require("./lib/livecoding"),
	'twitch': require("./lib/twitch"),
	'beam': require("./lib/beam")
});

require('./lib/spotify');
require('./lib/httpServer');
