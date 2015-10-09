self.port.on('ping', function shaarliPing(){
    var url = document.URL;
    var title = getTitle();
    var description = getDescription();

    var pageInfos = {
        shaareUrl: url,
        shaareTitle: title,
        shaareDescription: description,
    };

    self.port.emit('pong', pageInfos);
});

function getTitle() {
    var ogTitle = document.querySelector('meta[property="og:title"]');
    return (ogTitle) ? ogTitle.content : document.title;
}

function getDescription() {
    var description = window.getSelection().toString()
        || document.querySelector('meta[property="og:description"]').content
        || document.querySelector('meta[name="description"]').content;

    return (description) ? description : '';
}
