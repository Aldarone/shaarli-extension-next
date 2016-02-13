'use strict'

function buttonFactory (id, label, icon, onClick)
{
  var {ActionButton} = require('sdk/ui/button/action')
  var button

  if (typeof id === 'undefined'
    || typeof label === 'undefined'
    || typeof icon === 'undefined'
    || typeof icon[16] === 'undefined'
    || typeof icon[32] === 'undefined'
    || typeof icon[64] === 'undefined'
    || typeof onClick === 'undefined'
  ) {
    console.log(arguments)
    throw "Invalid arguments"
  }

  button = ActionButton({
    id: id,
    label: label,
    icon: icon
  })

  button.on('click', onClick)

  return button
}

exports.create = buttonFactory
