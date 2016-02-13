var self = require('sdk/self')
var buttonOnClick = require('./lib/shaarli.js').buttonOnClick
var contextOnMessage = require('./lib/shaarli.js').onMessage

require('./lib/buttonFactory.js').create(
  'shaarli-toolbar-button',
  'Shaare link!',
  {
    '16': self.data.url('icon-16.png'),
    '32': self.data.url('icon-32.png'),
    '64': self.data.url('icon-64.png')
  },
  buttonOnClick
)

require('./lib/contextFactory.js').create(
  'Shaare link!',
  self.data.url('icon-16.png'),
  self.data.url('js/context-get-info.js'),
  contextOnMessage
)
