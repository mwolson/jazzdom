describe('jazzdom/register', () => {
  it('installs globals immediately when loaded with require()', () => {
    expect(global.document).to.be.undefined
    require('../../register')
    expect(global.document).to.be.ok
  })
})
