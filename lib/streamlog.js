
var fs = require('fs');
var log = {
	'streamchat.txt': readLog('streamchat.txt'),
	'streamchat.html': readLog('streamchat.html'),
};


function readLog(file) {
	return fs.readFileSync(file).toString().split("\n")
}
function splitToLog(file, textMessage) {
	var mainline = textMessage.substring(0, 58);
	pushLog(file, mainline);
	if (textMessage.length > 58) {
		textMessage.substring(58).match(/.{0,55}/g).forEach(function (line) {
			if (!line || !line.length) return;
			pushLog(file, "   " + line);
		});
	}
	trimLog(file);
}
function streamLog(from, service, msg) {
	splitToLog('streamchat.txt', from + "@" + service + ": " + msg);
	var htmlMessage = cspan('from', from) + span(service.toLowerCase(), 'service', "@" + service)
		+ span('main-chat', 'main-chat', ": " + msg);
	pushLog('streamchat.html', htmlMessage);
	trimLog('streamchat.html');
}

function cspan(cls, text) {
	return span(Math.abs(hashCode(text)) % 16, cls, text);
}
function span(color, cls, text) {
	return `<span class="color-${color} ${cls}">${text}</span>`;
}
function pushLog(file, line) {
	if (!line || !line.trim().length) return;
	log[file].push(line);
}

function trimLog(file) {
	log[file].splice(0, log[file].length - 8);
	fs.writeFile(file, log[file].join("\n"));
}
module.exports = {
	log: streamLog,
	getLogs: function() {
		"use strict";
		return log['streamchat.html'];
	}
};

function hashCode(str) {
	var hash = 0, i, chr, len;
	if (str.length === 0) return hash;
	for (i = 0, len = str.length; i < len; i++) {
		chr   = str.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};
