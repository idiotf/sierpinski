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
]

async function sierpinski(
  method,
  step,
  x1, y1,
  x2, y2,
  x3, y3
) {
  ctx.beginPath()
  if (method.removeOuterLine) {
    ctx.moveTo(x1, y1)
  } else {
    ctx.moveTo(x3, y3)
    ctx.lineTo(x2, y2)
    await lineTo(x1, y1)
  }
  await method.run(step, x1, y1, x2, y2, x3, y3)
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
  for (const method of methods) {
    await sierpinski(
      method,
      steps,
      400 - sqrt3_2 * 320, 600,
      400, 120,
      400 + sqrt3_2 * 320, 600
    )
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }
}
