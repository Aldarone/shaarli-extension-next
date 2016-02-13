'use strict'

function makeUrl (shaarliUrl, urlParams) {
  return [
    shaarliUrl,
    '?',
    urlParams.join('&')
  ].join('')
}

var shaarliTab
function sendInTab (shaarliUrl, urlParams) {
  var tabs = require('sdk/tabs')
  var postUrl = makeUrl(shaarliUrl, urlParams)

  if (typeof shaarliTab !== 'undefined') {
    shaarliTab.url = postUrl
    shaarliTab.activate()
    return
  }

  tabs.open({
    url: postUrl,
    onOpen: function (tab) { shaarliTab = tab },
    onClose: function (tab) { shaarliTab = undefined }
  })
}

function sendInWindow (shaarliUrl, urlParams) {
  var {openDialog} = require('sdk/window/utils')
  var {prefs} = require('sdk/simple-prefs')

  var height = prefs.shaarliHeight
  var width = prefs.shaarliWidth

  var features = [
    'height=' + height,
    'width=' + width,
    'centerscreen=yes',
    'toolbar=no',
    'menubar=no',
    'scrollbars=no',
    'status=no',
    'dialog'
  ].join(',')

  urlParams.push('source=bookmarklet')

  openDialog({
    url: makeUrl(shaarliUrl, urlParams),
    features: features
  })
}

exports.sendInTab = sendInTab
exports.sendInWindow = sendInWindow
