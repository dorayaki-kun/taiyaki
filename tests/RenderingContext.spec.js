import { RenderingContext } from '../src/RenderingContext'

describe('RenderingContext tests', function() {
  it('contains spec with an expectation', function() {
    const canvas = '<canvas id="main"></canvas>'
    document.body.insertAdjacentHTML('afterbegin', canvas)
    new RenderingContext('main')
  })
})
