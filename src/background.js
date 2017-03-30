/* eslint-env webextensions */

function buttonClick () {
  const messageSent = browser.tabs.getCurrent().then(function (currentTab) {
    return browser.tabs.sendMessage(
      currentTab.id,
      'ping'
    )
  })

  messageSent.then(shaareIt)
}

function shaareIt (linkInfo) {
  function getPrefs () {
    return Promise.resolve({shaarliUrl: 'https://tools.aldarone.fr/', openInTab: false})
  }

  function makeLink (prefs) {
    const openInTab = prefs.openInTab
    const GET = [
      'post=' + encodeURIComponent(linkInfo.url),
      'title=' + encodeURIComponent(linkInfo.title),
      'description=' + encodeURIComponent(linkInfo.description),
      'source=bookmarklet'
    ]
    const url = [
      prefs.shaarliUrl,
      '?',
      GET.join('&')
    ].join('')

    return Promise.resolve({url, openInTab})
  }

  function openPopup (windowInfo) {
    browser.windows.create({
      url: windowInfo.url,
      type: 'popup',
      width: 600,
      heigth: 390
    })
  }

  getPrefs().then(makeLink).then(openPopup)
}

browser.browserAction.onClicked(buttonClick)
