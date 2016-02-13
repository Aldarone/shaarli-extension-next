'use strict'
function checkUrl (url) {
  var self = require('sdk/self')
  var notifications = require('sdk/notifications')
  var sdkUrl = require('sdk/url')
  var _ = require('sdk/l10n').get
  var throwException = false

  var notificationTitle = _('cfg_msg_title')
  var notificationMessage
  var exceptionMessage

  if (!url) {
    throwException = true
    notificationMessage = _('cfg_msg_text')
    exceptionMessage = 'No URL provided'
  }

  if (url && !sdkUrl.isValidURI(url)) {
    throwException = true
    notificationMessage = _('cfg_invalid_msg_text')
    exceptionMessage = 'Invalid URL provided'
  }

  if (throwException) {
    notifications.notify({
      'title': notificationTitle,
      'text': notificationMessage
    })

    require('sdk/preferences/utils').open(self)
    throw exceptionMessage
  }
}

function shaarliIt (url, title, description) {
  var {prefs} = require('sdk/simple-prefs')
  var shaarliUrl = prefs.shaarliUrl
  var openTab = prefs.shaarliOpenTab

  try {
    checkUrl(shaarliUrl)
  } catch (e) {
    console.log(e)
    return
  }

  var GET = [
    'post=' + encodeURIComponent(url),
    'title=' + encodeURIComponent(title),
    'description=' + encodeURIComponent(description)
  ]

  var sender = require('./sender.js')
  sender = (openTab) ? sender.sendInTab : sender.sendInWindow

  sender(shaarliUrl, GET)
}

function onMessage (info) {
  shaarliIt(info.url, info.title, info.description)
}

function buttonOnClick (state) {
  var tabs = require('sdk/tabs')
  var self = require('sdk/self')
  var worker = tabs.activeTab.attach({
    contentScriptFile: self.data.url('js/shaarli-get-infos.js')
  })

  worker.port.emit('ping')
  worker.port.on('pong', onMessage)
}

exports.buttonOnClick = buttonOnClick
exports.onMessage = onMessage
