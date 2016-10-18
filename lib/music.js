/*
 * Copyright (c) (2016) Starlis LLC / Daniel Ennis (Aikar)
 *
 *  http://aikar.co
 *  http://starlis.com
 *
 *  @license MIT
 *
 */

var music = {
	getSong: function() {
		return {title: "No Music Player Configured"};
	}
};
config.spotify = parseInt(config.spotify);
config.gpm = parseInt(config.gpm);

console.log(config.spotify, config.gpm);

if (config.spotify) {
	console.log("Loading Spotify");
	music = require('./spotify');
}  else if (config.gpm) {
	console.log("Loading GPM");
	music = require('./gpm');
} else {
	console.log("No Music Player");
}
module.exports = music;
