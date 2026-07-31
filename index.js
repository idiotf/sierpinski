const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.stroke()
}

async function lineTo(x, y) {
  ctx.lineTo(x, y)
  update()
  await new Promise(resolve => setTimeout(resolve, delay))
}

let recursive
const methods = [
  async function Pyramid(step, x1, y1, x2, y2, x3, y3) {
    if (step == 0) return

    const x12 = (x1 + x2) * 0.5, y12 = (y1 + y2) * 0.5
    const x23 = (x2 + x3) * 0.5, y23 = (y2 + y3) * 0.5
    const x13 = (x1 + x3) * 0.5, y13 = (y1 + y3) * 0.5

    await recursive(
      step - 1,
      x1, y1,
      x12, y12,
      x13, y13
    )
    await lineTo(x13, y13)
    await lineTo(x12, y12)
    await recursive(
      step - 1,
      x12, y12,
      x2, y2,
      x23, y23
    )
    await lineTo(x23, y23)
    await lineTo(x13, y13)
    await recursive(
      step - 1,
      x13, y13,
      x23, y23,
      x3, y3
    )
  },
  async function Leaf(step, x1, y1, x2, y2, x3, y3) {
    if (step == 0) return

    const x12 = (x1 + x2) * 0.5, y12 = (y1 + y2) * 0.5
    const x23 = (x2 + x3) * 0.5, y23 = (y2 + y3) * 0.5
    const x13 = (x1 + x3) * 0.5, y13 = (y1 + y3) * 0.5

    await lineTo(x13, y13)
    await recursive(
      step - 1,
      x13, y13,
      x1, y1,
      x12, y12
    )
    await lineTo(x12, y12)
    await recursive(
      step - 1,
      x12, y12,
      x2, y2,
      x23, y23
    )
    await lineTo(x23, y23)
    await recursive(
      step - 1,
      x23, y23,
      x3, y3,
      x13, y13
    )
    await lineTo(x13, y13)
  },
  async function Hybrid(step, x1, y1, x2, y2, x3, y3) {
    if (step == 0) return

    const x12 = (x1 + x2) * 0.5, y12 = (y1 + y2) * 0.5
    const x23 = (x2 + x3) * 0.5, y23 = (y2 + y3) * 0.5
    const x13 = (x1 + x3) * 0.5, y13 = (y1 + y3) * 0.5

    await recursive(
      step - 1,
      x1, y1,
      x12, y12,
      x13, y13
    )
    await lineTo(x13, y13)
    await lineTo(x12, y12)
    await recursive(
      step - 1,
      x12, y12,
      x2, y2,
      x23, y23
    )
    await lineTo(x23, y23)
    await recursive(
      step - 1,
      x23, y23,
      x3, y3,
      x13, y13
    )
    await lineTo(x13, y13)
  },
]

async function sierpinski(
  step,
  x1, y1,
  x2, y2,
  x3, y3
) {
  ctx.beginPath()
  ctx.moveTo(x3, y3)
  ctx.lineTo(x2, y2)
  await lineTo(x1, y1)
  await recursive(step, x1, y1, x2, y2, x3, y3)
  ctx.closePath()
  update()
}

const steps = 5
const delay = 50

ctx.strokeStyle = '#ff0000'
ctx.lineWidth = 4
ctx.lineCap = 'round'
ctx.lineJoin = 'round'

const sqrt3_2 = Math.sqrt(3) * 0.5

for (;;) {
  for (recursive of methods) {
    await sierpinski(
      steps,
      400 - sqrt3_2 * 320, 600,
      400, 120,
      400 + sqrt3_2 * 320, 600
    )
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }
}
