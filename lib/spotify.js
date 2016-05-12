/*
 * Copyright (c) (2016) Starlis LLC / Daniel Ennis (Aikar)
 *
 *  http://aikar.co
 *  http://starlis.com
 *
 *  @license MIT
 *
 */
'use strict';

var cp = require('child_process');
var curSong = null;
var curArt = null;
if (config.spotify) {
	setInterval(() => {
		cp.exec('sp current | grep -E "^Title"; echo "Art: $(sp art)"', (err, res) => {
			if (err) {
				console.error(err);
				return;
			}

			var m = res.toString().match(/Title\s+(.+)/);
			if (m && m[1]) {
				if (curSong != m[1]) {
					console.log("song changed from", curSong, "to", m[1]);
					curSong = m[1];
				}
			}
			m = res.toString().match(/Art:\s+(.+)/);
			if (m && m[1]) {
				curArt = m[1];
			} else {
				curArt = null;
			}
		});
	}, 1000);
}

module.exports = {
	getSong: () => {
		return {
			song: curSong,
			art: curArt
		};
	}
};
