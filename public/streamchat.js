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

$(function() {
	var streamjar = getCookie('streamjar');
	if (streamjar) {
		$('#streamjar').attr('src', streamjar).show();
	}
	var $chat = $('#chat');
	var $chatWrapper = $('#chat_wrapper');
	var $song = $('#song');
	var $songTitle = $('#song-title');
	var $songArt = $('#song-art');

	var lastChat, lastSong;
	var curSongTimeout;

	function updateChat(data) {
		if (lastChat == data) {
			return;
		}
		lastChat = data;
		var htmlChat = data
			.map( (e) => `<div class="chat-row">${e}</div>`)
			.join("\n").replace(/\d+(,\d+)?/g, '');
		$chat.html(htmlChat);
		$chatWrapper.animate({'scrollTop': $chatWrapper.height()});
	}

	function updateSpotify(data) {
		if (data == null) {
			return;
		}
		if (lastSong == data.song) {
			return;
		}
		lastSong = data.song;
		$songArt.attr('src', data.art);
		$songTitle.text(data.song);
		$song.fadeIn(500);
		clearTimeout(curSongTimeout);
		curSongTimeout = setTimeout( () => $song.fadeOut(500), 4000);
	}

	setInterval(function() {
		jQuery.getJSON('/data').done( function(data) {
			updateChat(data.chat);
			updateSpotify(data.song);
		});
	}, 1500);
});

function getCookie(name, def) {
	if (!name) { return def; }
	var d = decodeURIComponent,x;
	return (x=document.cookie.match(new RegExp(d(name) + '\\s*=\\s*([^;]*)')))&&d(x[1])||def;
}
