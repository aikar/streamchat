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
		$('#streamjar').attr('src', streamjar).css('z-index', -10000);
	}
	var $chat = $('#chat');
	var $chatWrapper = $('#chat_wrapper');
	var $song = $('#song');
	var $songTitle = $('#song-title .text');
	var $songArtist = $('#song-artist .text');
	var $songArt = $('#song-art');


	var lastChat, lastSong;
	var curSongTimeout;

	function updateChat(data) {
		if (lastChat == data) {
			return;
		}
		lastChat = data;
		var htmlChat = data
			.map( function (e) { return '<div class="chat-row">' + e + '</div>'; })
			.join("\n").replace(/\d+(,\d+)?/g, '');
		$chat.html(htmlChat);
		$chatWrapper.animate({'scrollTop': $chatWrapper.height()});
	}

	function updateMusic(data) {
		if (!data  || !data.title) {
			return;
		}
		if (lastSong == data.title) {
			return;
		}
		lastSong = data.title;
		$songArt.attr('src', data.art);
		$songArtist.text(data.artist);
		$songTitle.text(data.title.length < 120 ? data.title : data.title.substr(0, 120) + "...");
		$song.fadeIn(500);
		clearTimeout(curSongTimeout);
		curSongTimeout = setTimeout( function () { $song.fadeOut(500) }, 6000);
	}

	var $mumble = $('#mumble');
	var mumbleTimeout;
	var lastMumble = 0;
	function showMumble() {
		if (Date.now() - lastMumble < 1000 * 60 * 5) {
			return;
		}
		lastMumble = Date.now();
		$mumble.fadeIn(500);
		clearTimeout(mumbleTimeout);
		mumbleTimeout = setTimeout( function () { $mumble.fadeOut(500) }, 15000);
	}


	setInterval(function() {
		jQuery.getJSON('/data').done( function(data) {
			updateChat(data.chat);
			updateMusic(data.song);
			if (data.mumble) {
				showMumble();
			}
		});
	}, 1500);
});


function getCookie(name, def) {
	if (!name) { return def; }
	var d = decodeURIComponent,x;
	return (x=document.cookie.match(new RegExp(d(name) + '\\s*=\\s*([^;]*)')))&&d(x[1])||def;
}
