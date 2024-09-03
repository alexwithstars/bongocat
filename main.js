import './style.css'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const $up = document.getElementById('up')
const $down = document.getElementById('down')
const $left = document.getElementById('left')
const $right = document.getElementById('right')

const aspectRatio = $up.width / $up.height
const keysPressed = new Set()

let swap = false
let lastKey = null
let currentImage = $up

function resize () {
  canvas.height = window.innerHeight
  canvas.width = window.innerWidth
  draw(currentImage)
}

function draw (image) {
  currentImage = image
  const width = canvas.width
  const height = width / aspectRatio
  const x = canvas.width / 2 - width / 2
  const y = canvas.height / 2 - height / 2
  ctx.drawImage(image, x, y, width, height)
}
function setFrame ({ left, right }) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  if (left && right) draw($down)
  else if (!(left || right)) draw($up)
  else if (left) draw($left)
  else if (right) draw($right)
}

window.addEventListener('load', resize)
window.addEventListener('resize', resize)

document.addEventListener('keydown', e => {
  if (e.repeat) return
  keysPressed.add(e.code)
  if (keysPressed.size > 1) setFrame({ left: true, right: true })
  else {
    if (lastKey !== e.code) swap = !swap
    setFrame({ left: swap, right: !swap })
  }
})

document.addEventListener('keyup', e => {
  keysPressed.delete(e.code)
  if (keysPressed.size === 0) {
    setFrame({ left: false, right: false })
    lastKey = e.code
  } else setFrame({ left: swap, right: !swap })
})

document.addEventListener('touchstart', e => {
  e.clientX = e.touches[0].clientX
  if (e.clientX > canvas.width / 2) swap = true
  else swap = false
  setFrame({ left: swap, right: !swap })
  keysPressed.add('touch')
})

document.addEventListener('touchend', e => {
  setFrame({ left: false, right: false })
  keysPressed.delete('touch')
})

window.addEventListener('blur', e => {
  keysPressed.clear()
  setFrame({ left: false, right: false })
})
