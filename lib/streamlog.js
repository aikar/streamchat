
var fs = require('fs');
var log = [];
var logFile = config.log_file || 'streamchat.html';
var entities = require('html-entities').AllHtmlEntities;
if (fs.existsSync(logFile)) {
	log = readLog(logFile);
}

function readLog(file) {
	return fs.readFileSync(file).toString().split("\n")
}

function streamLog(from, service, msg) {
	var htmlMessage = cspan('from', from)
		+ span(service.toLowerCase(), 'service', "@" + service)
		+ span('main-chat', 'main-chat', ": " + msg);
	writeToLog(htmlMessage);
}

function cspan(cls, text) {
	return span(Math.abs(hashCode(text)) % 16, cls, text);
}
function span(color, cls, text) {
	text = entities.encode(text);
	return `<span class="color-${color} ${cls}">${text}</span>`;
}
function writeToLog(line) {
	if (!line || !line.trim().length) return;
	log.push(line);
	log.splice(0, log.length - 8);
	fs.writeFile(logFile, log.join("\n"), () => {});
}

module.exports = {
	log: streamLog,
	getLogs: function() {
		"use strict";
		return log;
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
}
