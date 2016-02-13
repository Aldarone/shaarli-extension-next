window.self.port.on('ping', function shaarliPing () {
  var url = document.URL
  var title = getTitle()
  var description = getDescription()

  var pageInfos = {
    url: url,
    title: title,
    description: description
  }

  window.self.port.emit('pong', pageInfos)
})

function getTitle () {
  var ogTitle = document.querySelector('meta[property="og:title"]')
  return (ogTitle) ? ogTitle.content : document.title
}

function getDescription () {
  var selection = window.getSelection().toString()
  var metaDescription = document.querySelector('meta[property="og:description"]') ||
    document.querySelector('meta[name="description"]')
  var description = (description) ? metaDescription.content : ''

  return selection || description
}
