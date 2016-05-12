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
	var streamjar = getCookie('streamjar');
	if (streamjar) {
		$('#streamjar').attr('src', streamjar).show();
	}
	var $chat = $('#chat');
	setInterval(function() {
		jQuery.ajax('/chat').done( function(data) {
			if (last == data) {
				$chat.animate({'scrollTop': $chat.height()});
				return;
			}
			last = data;
			$chat.html(data).css('z-index', 5);
			$chat.animate({'scrollTop': $chat.height()});
		});
	}, 1500);
});

function getCookie(name, def) {
	if (!name) { return def; }
	var d = decodeURIComponent,x;
	return (x=document.cookie.match(new RegExp(d(name) + '\\s*=\\s*([^;]*)')))&&d(x[1])||def;
}
