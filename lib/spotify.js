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
var songMeta = {};
if (config.spotify) {
	setInterval(() => {
		cp.exec('sp metadata', (err, res) => {
			if (err) {
				//console.error(err);
				return;
			}
			var m, r=/([a-zA-Z]+?)\|(.*)/g;
			songMeta = {};
			while (m = r.exec(res)) {
				songMeta[m[1]] = m[2];
			}
		});
	}, 1000);

}

module.exports = {
	getSong: () => {
		return {
			meta: songMeta,
			title: songMeta.title,
			art: songMeta.artUrl,
			artist: songMeta.artist
		};
	}
};
