if (typeof shaarli == "undefined") {
	var shaarli = {
		_prefs: Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService).getBranch("extensions.shaarli@imirhil.fr."),

		installButton: function (toolbarId, id, afterId) {
				if (!document.getElementById(id)) {
						var toolbar = document.getElementById(toolbarId);

						// If no afterId is given, then append the item to the toolbar
						var before = null;
						if (afterId) {
								var elem = document.getElementById(afterId);
								if (elem && elem.parentNode == toolbar)
										before = elem.nextElementSibling;
						}

						toolbar.insertItem(id, before);
						toolbar.setAttribute("currentset", toolbar.currentSet);
						document.persist(toolbar.id, "currentset");

						if (toolbarId == "addon-bar")
								toolbar.collapsed = false;
				}
		},

		post: function(event) {
			var url = content.document.location.href;
			var title = content.document.title || url;

			var width = 600;
			var height = 390;
			var left = window.mozInnerScreenX + (window.innerWidth - width) / 2;
			var top = window.mozInnerScreenY + (window.innerHeight - height) / 2;

			window.open(this._prefs.getCharPref("url") + "?post=" + encodeURIComponent(url) + "&title=" + encodeURIComponent(title) + "&source=bookmarklet",
									"", "height=" + height + ",width=" + width + ",top=" + top + ",left=" + left + ",toolbar=no,menubar=no,scrollbars=no,status=no,dialog,modal");
			event.stopPropagation();
		},

		open: function(event) {
			gBrowser.selectedTab = gBrowser.addTab(this._prefs.getCharPref("url"));
			event.stopPropagation();
		}
	};

	window.addEventListener("load", function() {
		Application.getExtensions(function(extensions) {
			var extension = extensions.get("shaarli@imirhil.fr");
			if (extension.firstRun) {
				shaarli.installButton("nav-bar", "shaarli-toolbar-button");
			}
		});
	}, false);
}
