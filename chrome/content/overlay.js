var prefs = Components.classes["@mozilla.org/preferences-service;1"]
	.getService(Components.interfaces.nsIPrefService).getBranch("extensions.shaarli.");

var shaarli = {
  post: function() {
		var url = content.document.location.href;
		var title = content.document.title || url;
    window.open(prefs.getCharPref('url') + '?post=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title) + '&source=bookmarklet',
								'', 'chrome,centerscreen');
  }
};
