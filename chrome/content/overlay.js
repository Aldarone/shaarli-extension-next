var prefs = Components.classes["@mozilla.org/preferences-service;1"]
	.getService(Components.interfaces.nsIPrefService).getBranch("extensions.shaarli@imirhil.fr.");

var shaarli = {
  post: function(event) {
		var url = content.document.location.href;
		var title = content.document.title || url;

		var width = 600;
		var height = 390;
		var left = window.mozInnerScreenX + (window.innerWidth - width) / 2;
		var top = window.mozInnerScreenY + (window.innerHeight - height) / 2;

    window.open(prefs.getCharPref("url") + "?post=" + encodeURIComponent(url) + "&title=" + encodeURIComponent(title) + "&source=bookmarklet",
								"", "height=" + height + ",width=" + width + ",top=" + top + ",left=" + left + ",toolbar=no,menubar=no,scrollbars=no,status=no,dialog,modal");
		event.stopPropagation();
  },

	open: function(event) {
		gBrowser.selectedTab = gBrowser.addTab(prefs.getCharPref("url"));
		event.stopPropagation();
	}
};

/**
 * Installs the toolbar button with the given ID into the given
 * toolbar, if it is not already present in the document.
 *
 * @param {string} toolbarId The ID of the toolbar to install to.
 * @param {string} id The ID of the button to install.
 * @param {string} afterId The ID of the element to insert after. @optional
 */
function installButton(toolbarId, id, afterId) {
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
}

window.addEventListener("load", function() {
	Application.getExtensions(function(extensions) {
		var extension = extensions.get("shaarli@imirhil.fr");
		if (extension.firstRun) {
			installButton("nav-bar", "shaarli-toolbar-button");
		}
	});
}, false);
