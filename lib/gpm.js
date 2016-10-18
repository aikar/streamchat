/*
 * Copyright (c) (2016) Starlis LLC / Daniel Ennis (Aikar)
 *
 *  http://aikar.co
 *  http://starlis.com
 *
 *  @license MIT
 *
 */

var file = config.gpm_json_file;
var songMeta = {title: ""};
var fs = require('fs');
var lastPlaying = 0;
if (file) {
	setInterval(() => {
		fs.readFile(file, function (err, data) {
			if (!err && data) {
				var newMeta = JSON.parse(data.toString());
				if (newMeta.playing) {
					lastPlaying = Date.now();
				} else if (Date.now() - lastPlaying < 1000 * 30) {
					return;
				}

				songMeta = newMeta;
			}
		})
	}, 5000);

}

module.exports = {
	getSong: () => {
		if (songMeta && songMeta.playing) {
			return {
				meta: songMeta,
				title: songMeta.song.title,
				art: songMeta.song.albumArt,
				artist: songMeta.song.artist
			};
		} else {
			return {
				meta: {},
				title: "",
				art: "",
				artist: ""
			};
		}
	}
};
