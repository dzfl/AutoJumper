// ==UserScript==
// @name           AutoJumper
// @namespace      http://www.kalafla.org
// @include        http://*
// @require        http://gist.github.com/3242.txt#$X
// ==/UserScript==

(function(){

	const API = 'http://wedata.net/databases/AutoJumper/items.json';
	const EXPIRES = 7;

	GM_registerMenuCommand('AutoJumper - clear cache', clearCache);

	var now = new Date;
	var siteinfo = load();

	if ( !siteinfo || siteinfo.expires <= now) {
		clearCache();
	}

	jump(siteinfo.data);

	function jump(siteinfo) {
		var i = siteinfo.length;
		while(i--) {
			var item  = siteinfo[i].data;
			var url   = item.url;
			var xpath = item.xpath;
			var regex = item.regex;
			var click = item.click;
			if (new RegExp(url).test(location.href)) {
				if(xpath) {
					var a = $X(xpath)[0];
					location.href = a;
				} else if (regex) {
					var a = new RegExp(regex).exec(document.body.innerHTML)[1];
					location.href = a;
				} else if (click) {
					var a = $X(click)[0];
					var evt = document.createEvent('MouseEvent');
					evt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
					a.dispatchEvent(evt);
				}
			}
		}
	}

	function getSiteinfo() {
		GM_xmlhttpRequest({
			method: 'GET',
			url   : API,
			onload: function(r) {
				var data = JSON.parse(r.responseText);
				save(data);
				siteinfo = load();
			}
		});
	}

	function save(data) {
		var data = JSON.stringify({
			data   : data,
			expires: +new Date + 1000 * 60 * 60 * 24 * EXPIRES
		}) ;
		GM_setValue('data', data);
	}

	function load() {
		var data = GM_getValue('data', undefined);
		try {
			return JSON.parse(data);
		} catch(e) {
			return undefined;
		}
	}

	function clearCache() {
		getSiteinfo();
	}

}())

