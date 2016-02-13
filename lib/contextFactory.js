'use strict'

function contextFactory (label, image, scriptFile, onMessage, context) {
  var {Item} = require('sdk/context-menu')

  return Item({
    label: label,
    image: image,
    context: context || require('sdk/context-menu').SelectorContext('a[href]'),
    contentScriptFile: scriptFile,
    onMessage: onMessage
  })
}

exports.create = contextFactory
