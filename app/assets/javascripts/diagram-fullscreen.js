window.AppFrontend = window.AppFrontend || {}

window.AppFrontend.diagramFullscreen = function () {
  const overlay = document.querySelector('[data-module="app-diagram-fullscreen"]')
  if (!overlay) {
    return
  }

  const stage = overlay.querySelector('.app-diagram-fullscreen__stage')
  const closeButton = overlay.querySelector('.app-diagram-fullscreen__close')
  let returnFocus = null
  const expandIcon = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M4 9V4h5v2H6v3H4zm10-5h5v5h-2V6h-3V4zM4 15h2v3h3v2H4v-5zm14 3v-3h2v5h-5v-2h3z"/></svg>'

  function closeDiagram () {
    if (overlay.hidden) {
      return
    }

    stage.replaceChildren()
    overlay.hidden = true
    document.body.style.overflow = ''

    if (returnFocus) {
      returnFocus.focus()
    }
  }

  function openDiagram (frame, button) {
    const source = frame.querySelector('svg.flowchart')
    if (!source) {
      return
    }

    returnFocus = button
    const chart = source.cloneNode(true)
    chart.classList.add('app-diagram-fullscreen__chart')
    stage.replaceChildren(chart)
    overlay.hidden = false
    document.body.style.overflow = 'hidden'
    closeButton.focus()
  }

  document.querySelectorAll('pre.mermaid').forEach(function (frame) {
    const wrapper = document.createElement('div')
    wrapper.className = 'app-diagram'
    frame.parentNode.insertBefore(wrapper, frame)
    wrapper.appendChild(frame)

    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'app-diagram__expand'
    button.setAttribute('aria-label', 'View diagram full screen')
    button.innerHTML = expandIcon
    button.addEventListener('click', function () {
      openDiagram(frame, button)
    })
    wrapper.appendChild(button)
  })

  closeButton.addEventListener('click', closeDiagram)
  overlay.addEventListener('click', function (event) {
    if (event.target === overlay) {
      closeDiagram()
    }
  })

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeDiagram()
    }
  })
}
