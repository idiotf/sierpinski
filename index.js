const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

let path = new Path2D()
function update(strokePath = path) {
  ctx.strokeStyle = '#ff0000'
  ctx.lineWidth = 4
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  ctx.resetTransform()
  ctx.scale(canvas.width / 800, canvas.height / 800)

  ctx.clearRect(0, 0, 800, 800)
  ctx.stroke(strokePath)
}

let lastX, lastY
async function lineTo(x, y) {
  const prevX = lastX, prevY = lastY
  lastX = x
  lastY = y

  if (animate) {
    const startTime = performance.now()
    let rAF = requestAnimationFrame(function frame(time) {
      rAF = requestAnimationFrame(frame)

      const t = (time - startTime) / delay
      if (t <= 0) return

      const newPath = new Path2D(path)
      if (t >= 1) newPath.lineTo(x, y)
      else newPath.lineTo((1 - t) * prevX + t * x, (1 - t) * prevY + t * y)

      update(newPath)
    })

    await new Promise(resolve => setTimeout(resolve, delay))
    cancelAnimationFrame(rAF)
    path.lineTo(x, y)
  } else {
    path.lineTo(x, y)
    update()
    await new Promise(resolve => setTimeout(resolve, delay))
  }
}

const methods = [
  {
    name: 'Pyramid',
    run: async function pyramid(step, x1, y1, x2, y2, x3, y3) {
      if (step == 0) return
      
      const x12 = (x1 + x2) * 0.5, y12 = (y1 + y2) * 0.5
      const x23 = (x2 + x3) * 0.5, y23 = (y2 + y3) * 0.5
      const x13 = (x1 + x3) * 0.5, y13 = (y1 + y3) * 0.5
      
      await pyramid(
        step - 1,
        x1, y1,
        x12, y12,
        x13, y13
      )
      await lineTo(x13, y13)
      await lineTo(x12, y12)
      await pyramid(
        step - 1,
        x12, y12,
        x2, y2,
        x23, y23
      )
      await lineTo(x23, y23)
      await lineTo(x13, y13)
      await pyramid(
        step - 1,
        x13, y13,
        x23, y23,
        x3, y3
      )
    },
  },
  {
    name: 'Leaf',
    run: async function leaf(step, x1, y1, x2, y2, x3, y3) {
      if (step == 0) return
      
      const x12 = (x1 + x2) * 0.5, y12 = (y1 + y2) * 0.5
      const x23 = (x2 + x3) * 0.5, y23 = (y2 + y3) * 0.5
      const x13 = (x1 + x3) * 0.5, y13 = (y1 + y3) * 0.5
      
      await lineTo(x13, y13)
      await leaf(
        step - 1,
        x13, y13,
        x1, y1,
        x12, y12
      )
      await lineTo(x12, y12)
      await leaf(
        step - 1,
        x12, y12,
        x2, y2,
        x23, y23
      )
      await lineTo(x23, y23)
      await leaf(
        step - 1,
        x23, y23,
        x3, y3,
        x13, y13
      )
      await lineTo(x13, y13)
    },
  },
  {
    name: 'Snake',
    removeOuterLine: true,
    run: async function snake(step, x1, y1, x2, y2, x3, y3) {
      async function part1(step, x1, y1, x2, y2, x3, y3) {
        const x12 = (x1 + x2) * 0.5, y12 = (y1 + y2) * 0.5
        const x23 = (x2 + x3) * 0.5, y23 = (y2 + y3) * 0.5
        const x13 = (x1 + x3) * 0.5, y13 = (y1 + y3) * 0.5

        if (step == 1) {
          await lineTo(x13, y13)
          await lineTo(x12, y12)
        } else {
          await part1(step - 1, x1, y1, x12, y12, x13, y13)
          await lineTo(x12, y12)
          await part1(step - 1, x12, y12, x2, y2, x23, y23)
        }
      }

      async function part2(step, x1, y1, x2, y2, x3, y3) {
        const x12 = (x1 + x2) * 0.5, y12 = (y1 + y2) * 0.5
        const x23 = (x2 + x3) * 0.5, y23 = (y2 + y3) * 0.5
        const x13 = (x1 + x3) * 0.5, y13 = (y1 + y3) * 0.5

        if (step == 1) {
          await lineTo(x23, y23)
          await lineTo(x13, y13)
        } else {
          await part2(step - 1, x12, y12, x2, y2, x23, y23)
          await lineTo(x23, y23)
          await part3(step - 1, x12, y12, x2, y2, x23, y23)
          await lineTo(x12, y12)
          await part2(step - 1, x1, y1, x12, y12, x13, y13)
          await lineTo(x13, y13)
          await part3(step - 1, x3, y3, x23, y23, x13, y13)
        }
      }

      async function part3(step, x1, y1, x2, y2, x3, y3) {
        const x12 = (x1 + x2) * 0.5, y12 = (y1 + y2) * 0.5
        const x23 = (x2 + x3) * 0.5, y23 = (y2 + y3) * 0.5
        const x13 = (x1 + x3) * 0.5, y13 = (y1 + y3) * 0.5

        if (step == 1) {
          await lineTo(x23, y23)
          await lineTo(x12, y12)
        } else {
          await part1(step - 1, x3, y3, x23, y23, x13, y13)
          await lineTo(x23, y23)
          await part2(step - 1, x3, y3, x23, y23, x13, y13)
          await lineTo(x13, y13)
          await part3(step - 1, x1, y1, x12, y12, x13, y13)
        }
      }

      if (step == 0) {
        await lineTo(x2, y2)
        await lineTo(x3, y3)
      } else {
        await part1(step, x1, y1, x2, y2, x3, y3)
        await lineTo(x2, y2)
        await part2(step, x1, y1, x2, y2, x3, y3)
        await lineTo(x3, y3)
        await part3(step, x1, y1, x2, y2, x3, y3)
      }
    },
  },
  {
    name: 'Boomerang',
    removeOuterLine: true,
    run: async function boomerang(step, x1, y1, x2, y2, x3, y3) {
      async function arrowhead(step, x1, y1, x2, y2, x3, y3) {
        if (step == 0) return

        const x12 = (x1 + x2) * 0.5, y12 = (y1 + y2) * 0.5
        const x23 = (x2 + x3) * 0.5, y23 = (y2 + y3) * 0.5
        const x13 = (x1 + x3) * 0.5, y13 = (y1 + y3) * 0.5

        await arrowhead(step - 1, x1, y1, x13, y13, x12, y12)
        await lineTo(x12, y12)
        await arrowhead(step - 1, x12, y12, x2, y2, x23, y23)
        await lineTo(x23, y23)
        await arrowhead(step - 1, x23, y23, x13, y13, x3, y3)
      }

      async function back(step, x1, y1, x2, y2, x3, y3) {
        if (step == 0) return lineTo(x2, y2)

        const x12 = (x1 + x2) * 0.5, y12 = (y1 + y2) * 0.5
        const x23 = (x2 + x3) * 0.5, y23 = (y2 + y3) * 0.5
        const x13 = (x1 + x3) * 0.5, y13 = (y1 + y3) * 0.5

        await back(step - 1, x1, y1, x13, y13, x12, y12)
        await lineTo(x12, y12)
        await back(step - 1, x12, y12, x2, y2, x23, y23)
        await lineTo(x23, y23)
        await back(step - 1, x23, y23, x13, y13, x3, y3)
      }

      await arrowhead(step, x1, y1, x2, y2, x3, y3)
      await lineTo(x3, y3)
      await back(step, x3, y3, x2, y2, x1, y1)
    },
  },
  {
    name: 'Sierpinski Knots',
    reference: 'https://match.pmf.kg.ac.rs/electronic_versions/Match68/n2/match68n2_595-610.pdf',
    removeOuterLine: true,
    run: async function knots(step, x1, y1, x2, y2, x3, y3) {
      async function arrowhead(step, x1, y1, x2, y2, x3, y3) {
        if (step == 0) return

        const x12 = (x1 + x2) * 0.5, y12 = (y1 + y2) * 0.5
        const x23 = (x2 + x3) * 0.5, y23 = (y2 + y3) * 0.5
        const x13 = (x1 + x3) * 0.5, y13 = (y1 + y3) * 0.5

        await arrowhead(step - 1, x1, y1, x13, y13, x12, y12)
        await lineTo(x12, y12)
        await arrowhead(step - 1, x12, y12, x2, y2, x23, y23)
        await lineTo(x23, y23)
        await arrowhead(step - 1, x23, y23, x13, y13, x3, y3)
      }

      await arrowhead(step, x1, y1, x2, y2, x3, y3)
      await lineTo(x3, y3)
      await arrowhead(step, x3, y3, x1, y1, x2, y2)
      await lineTo(x2, y2)
      await arrowhead(step, x2, y2, x3, y3, x1, y1)
    },
  },
]

async function sierpinski(
  method,
  step,
  x1, y1,
  x2, y2,
  x3, y3
) {
  let x, y
  if (method.removeOuterLine) {
    path.moveTo((x = lastX = x1), (y = lastY = y1))
  } else {
    path.moveTo((x = lastX = x3), (y = lastY = y3))
    path.lineTo(x2, y2)
    if (animate) path.lineTo(x1, y1)
    else await lineTo(x1, y1)
  }
  await method.run(step, x1, y1, x2, y2, x3, y3)
  if (animate) await lineTo(x, y)
  path.closePath()
  update()
}

const searchParams = new URLSearchParams(location.search)

const steps = 5
const delay = 50
const animate = searchParams.has('animate')

canvas.addEventListener('contextrestored', () => update())

const resizeObserver = new ResizeObserver(([entry]) => {
  canvas.width = entry.devicePixelContentBoxSize[0].inlineSize
  canvas.height = entry.devicePixelContentBoxSize[0].blockSize
  update()
})
resizeObserver.observe(canvas, { box: 'device-pixel-content-box' })

const sqrt3_2 = Math.sqrt(3) * 0.5

;(async () => {
  for (;;) {
    for (const method of methods) {
      await sierpinski(
        method,
        steps,
        400 - sqrt3_2 * 320, 600,
        400, 120,
        400 + sqrt3_2 * 320, 600
      )
      await new Promise((resolve) => setTimeout(resolve, 1500))
      path = new Path2D()
    }
  }
})()
