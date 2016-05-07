/*
 * Copyright (c) (2016) Starlis LLC / Daniel Ennis (Aikar)
 *  
 *  http://aikar.co
 *  http://starlis.com
 *  
 *  @license MIT
 *  
 */
var last;
$(function() {
	var $chat = $('#chat');
	setInterval(function() {
		jQuery.ajax('/chat').done( function(data) {
			if (last == data) {
				return;
			}
			last = data;
			$chat.html(data);
			$chat.animate({'scrollTop': $chat.height()});
		});
	}, 1500);
});
