window.self.on('click', function (node, data) {
  window.self.postMessage(
    {
      url: node.href,
      title: node.title || node.textContent,
      description: node.textContent
    }
  )
})
