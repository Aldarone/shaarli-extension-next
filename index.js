var self = require('sdk/self');
var tabs = require('sdk/tabs');
var workers = require('sdk/content/worker');
var urls = require('sdk/url');
var _ = require("sdk/l10n").get;

var {ActionButton} = require('sdk/ui/button/action');
var {openDialog} = require('sdk/window/utils');

var toolbarButton = ActionButton({
    id: 'shaarli-toolbar-button',
    label: 'Shaare link',
    icon: {
        '16': self.data.url('icon-16.png'),
        '32': self.data.url('icon-32.png'),
        '64': self.data.url('icon-64.png')
    }
});

var shaarliTab;

function shaarliIt(url, title, description) {
    var prefs = require('sdk/simple-prefs').prefs;
    var shaarliUrl = prefs.shaarliUrl;
    var height = prefs.shaarliHeight;
    var width = prefs.shaarliWidth;
    var openTab = prefs.shaarliOpenTab;

    // If the URL is not set in the preferences, open the preference dialog for the add-on.
    if (!shaarliUrl) {
        var notifications = require("sdk/notifications");
        notifications.notify({
            title: _("cfg_msg_title"),
            text: _("cfg_msg_text")
        });
        var am = require("sdk/preferences/utils");
        am.open(self);
        return;
    }
    if (!urls.isValidURI(shaarliUrl)) {
        var notifications = require("sdk/notifications");
        notifications.notify({
            title: _("cfg_msg_title"),
            text: _("cfg_invalid_msg_text")
        });
        var am = require("sdk/preferences/utils");
        am.open(self);
        return;
    }

    var GET = [
        'post='+encodeURIComponent(url),
        'title='+encodeURIComponent(title),
        'description='+encodeURIComponent(description),
    ];

    if (! openTab) {
      GET.push('source=bookmarklet');
    }

    var features = [
        'height='+height,
        'width='+width,
        'centerscreen=yes',
        'toolbar=no',
        'menubar=no',
        'scrollbars=no',
        'status=no',
        'dialog'
    ];

    var postUrl = shaarliUrl+"?"+GET.join('&');

    if (openTab) {
        if (typeof shaarliTab !== 'undefined') {
            shaarliTab.url = postUrl;
            shaarliTab.activate();
        } else
            tabs.open({
                url: postUrl,
                onOpen: function onOpen(tab)
                {
                    shaarliTab = tab;
                },
                onClose: function onClose(tab)
                {
                    delete shaarliTab;
                }
            });
    } else {
        openDialog({
            url: postUrl,
            features: features.join(',')
        });
    }
}

var shaarli = {
    buttonClick: function shaarliButtonClick(state) {
        var worker = tabs.activeTab.attach({
            contentScriptFile: self.data.url('js/shaarli-get-infos.js')
        });

        worker.port.emit('ping');
        worker.port.on('pong', shaarli.postLink);
    },

    postLink: function shaarliPostLink(linkInfo) {
        var url = linkInfo.shaareUrl;
        var title = linkInfo.shaareTitle;
        var description = linkInfo.shaareDescription;

    shaarliIt(url, title, description);
    }
};

toolbarButton.on('click', shaarli.buttonClick);

require("sdk/context-menu").Item({
    label: "Shaarli it!",
    image: self.data.url('icon-16.png'),
    context: require("sdk/context-menu").SelectorContext("a[href]"),
    contentScript: 'self.on("click", function (node, data) {' +
        '  self.postMessage({url: node.href, title: node.textContent, desc: "" });' +
            '});',
    onMessage: function (info) {
        shaarliIt(info.url, info.title, info.desc);
    }
});
