var self = require('sdk/self');
var tabs = require('sdk/tabs');
var workers = require('sdk/content/worker');
var ss = require('sdk/simple-storage');

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

var shaarli = {
    tabReady: function shaarliTabReady(tab) {
        var worker = tab.attach({
            contentScriptFile: self.data.url('js/shaarli-get-infos.js')
        });

        worker.port.emit("ping", {tabId: tab.id});
        worker.port.on("pong", shaarli.setTabState);
    },

    tabClose: function shaarliTabClose(tab) {
        delete ss.storage.tabState[tab.id];
    },

    setTabState: function shaarliSetTabState(linkInfo) {
        ss.storage.tabState[linkInfo.tabId] = linkInfo;
    },

    postLink: function shaarliPostLink() {
        var tabState = ss.storage.tabState[tabs.activeTab.id];
        var shaarliUrl = require('sdk/simple-prefs').prefs.shaarliUrl;
        var height = require('sdk/simple-prefs').prefs.shaarliHeight;
        var width = require('sdk/simple-prefs').prefs.shaarliWidth;

        console.log(tabState);

        var url = tabState.shaareUrl;
        var title = tabState.shaareTitle;
        var description = tabState.shaareDescription;

        var GET = [
            'post='+encodeURIComponent(url),
            'title='+encodeURIComponent(title),
            'description='+encodeURIComponent(description),
            'source=bookmarklet'
        ];

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

        console.log(shaarliUrl+"?"+GET.join('&'));

        openDialog({
            url: shaarliUrl+"?"+GET.join('&'),
            features: features.join(',')
        });
    }
};

toolbarButton.on('click', shaarli.postLink);
tabs.on('ready', shaarli.tabReady);
tabs.on('close', shaarli.tabClose);
ss.storage.tabState = {};
