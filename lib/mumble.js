/*
 * Copyright (c) (2016) Starlis LLC / Daniel Ennis (Aikar)
 *
 *  http://aikar.co
 *  http://starlis.com
 *
 *  @license MIT
 *
 */
var exec = require('child_process').execSync;
module.exports = {
	isRunning: function() {
		"use strict";
		var res = exec("(ps ax | grep mumble | grep -v grep)||echo").toString().trim();
		return res.length > 0;
	}
};
