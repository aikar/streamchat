/*
 * Copyright (c) (2017) Starlis LLC / Daniel Ennis (Aikar)
 *
 *  http://aikar.co
 *  http://starlis.com
 *
 *  @license MIT
 *
 */

global.co = require('co');
global.each = require('co-each');
global.config = require('ini').parse(require('fs').readFileSync(__dirname + '/../config.ini').toString());

global.debug = function() {
	console.log(arguments);
};
global.services = require('./core').register({
	'hitbox': require("./hitbox"),
	'livecoding': require("./livecoding"),
	'twitch': require("./twitch"),
	'beam': require("./beam"),
	'discord': require('./discord')
});

require('./music');
require('./httpServer');
