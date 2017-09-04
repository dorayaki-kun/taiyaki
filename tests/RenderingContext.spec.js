import { RenderingContext } from '../src/RenderingContext'

describe('RenderingContext tests', () => {
  afterEach(() => {
    const root = document.body
    while (root.firstChild) {
      root.removeChild(root.firstChild)
    }
  })

  it('Should pass when exists specified HTMLCanvasElement', () => {
    const canvas = '<canvas id="main"></canvas>'
    document.body.insertAdjacentHTML('afterbegin', canvas)
    new RenderingContext('main')
  })

  it('Should throw error when missing specified HTMLCanvasElement', () => {
    const canvas = '<canvas id="missing"></canvas>'
    document.body.insertAdjacentHTML('afterbegin', canvas)
    expect(() => {
      new RenderingContext('main')
    }).toThrow(new Error('Missing HTMLCanvasElement id: main'))
  })
})
