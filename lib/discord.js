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
var Discord = require('eris');
var bot = new Discord(config.discord_bottoken);

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
	bot.removeAllListeners("messageCreate");
	bot.on('messageCreate',  function(msg) {
		//console.log(msg);
		const userID = msg.author.id;
		if (userID !== config.discord_hook1id && userID !== config.discord_hook2id && userID !== "238835293560635393") {
			let text = msg.content;
			for (const user of msg.mentions) {
				text = text.replace(new RegExp('<@!?' + user.id + '>', 'g'), '@' + user.username);
			}
			cb(msg.author.username, text);
		}
	});
}
module.exports = {
	listen: listen,
	sendChat: sendDiscordChat,
	isRunning: function() {
        const res = exec("(ps ax | grep discord | grep -v grep)||echo").toString().trim();
        return res.length > 0;
	}
};
bot.connect();
