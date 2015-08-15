self.port.on('ping', function shaarliPing(message){
    var url = document.URL;
    var title = getTitle();
    var description = getDescription();

    var pageInfos = {
        shaareUrl: url,
        shaareTitle: title,
        shaareDescription: description,
        tabId: message.tabId
    };

    self.port.emit('pong', pageInfos);
});

function getTitle() {
    var ogTitle = document.querySelector('meta[property="og:title"]');
    return (ogTitle) ? ogTitle.content : document.title;
}

function getDescription() {
    var description = document.querySelector('meta[property="og:description"]') || document.querySelector('meta[name="description"]');

    return (description) ? description.content : '';
}
