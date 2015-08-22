var self = require('sdk/self');
var tabs = require('sdk/tabs');
var workers = require('sdk/content/worker');

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
    buttonClick: function shaarliButtonClick(state) {
        var worker = tabs.activeTab.attach({
            contentScriptFile: self.data.url('js/shaarli-get-infos.js')
        });

        worker.port.emit('ping');
        worker.port.on('pong', shaarli.postLink);
    },

    postLink: function shaarliPostLink(linkInfo) {
        var shaarliUrl = require('sdk/simple-prefs').prefs.shaarliUrl;
        var height = require('sdk/simple-prefs').prefs.shaarliHeight;
        var width = require('sdk/simple-prefs').prefs.shaarliWidth;

        var url = linkInfo.shaareUrl;
        var title = linkInfo.shaareTitle;
        var description = linkInfo.shaareDescription;

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

        openDialog({
            url: shaarliUrl+"?"+GET.join('&'),
            features: features.join(',')
        });
    }
};

toolbarButton.on('click', shaarli.buttonClick);
