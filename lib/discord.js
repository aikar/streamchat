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
var request = require('request');
var exec = require('child_process').execSync;
var Discord = require('discord.io');
var bot = new Discord.Client({
	token: config.discord_bottoken,
	autorun: true
});

var hookIds = [config.discord_hook1, config.discord_hook2];
var curHook = 0;


bot.on('ready', function() {
	console.log("Discord connected as " + bot.username);
});
bot.on('error', function (e) {
	console.error("Discord Error", e);
});
bot.on('disconnect', function() {
	setTimeout(() => bot.connect(), 3000);
	console.error("Discord end", arguments);
});

var lastUser;
function sendDiscordChat(service, author, message) {
	if (service == 'discord') {
		return;
	}
	var user = author + '@' + service;
	if (user != lastUser) {
		curHook = curHook == 1 ? 0 : 1;
		lastUser = user;
	}
	var payload = {
		content: message,
		username: user,
		avatar_url: 'https://robohash.org/' + user,
	};
	request({
		url:hookIds[curHook],
		method:"POST",
		body:payload,
		json:true
	}, (e,r,b) => {
		if (e) throw e;
	});
}
function listen(cb) {
	bot.on('message',  function(user, userID, channelID, message) {
		if (userID != config.discord_hook1id && userID != config.discord_hook2id && userID != "238835293560635393") {
			cb(user, message);
		}
	});
}
module.exports = {
	listen: listen,
	sendChat: sendDiscordChat,
	isRunning: function() {
		"use strict";
		var res = exec("(ps ax | grep discord | grep -v grep)||echo").toString().trim();
		return res.length > 0;
	}
}
