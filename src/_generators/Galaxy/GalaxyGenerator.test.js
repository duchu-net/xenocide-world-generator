import expect from 'expect'
import GalaxyGenerator from './GalaxyGenerator'
// import { SteppedAction } from 'duchunet-utils'


describe('GalaxyGenerator: model', () => {
  describe('galaxy asynchronous', () => {
    it ('should generate 1 galaxy', (done) => {
      const action = new SteppedAction()
      action.progressUpdater = (p) => {
        console.log(p.getCurrentActionName(), (p.getProgress() * 100).toFixed(2) + '%')
      }

      const galaxy = new GalaxyGenerator({ model: { seed: 'dupa', name: 'echo' } })

      action
  		  .executeSubaction((action) => {
          galaxy.generate(action)
        }, 1)
        .getResult((result) => {
          // console.log('generateGalaxy result', result)
          const systems = result.systems.length
          const planets = result.systems.map(s => s.planets_count).reduce((a,b)=>(a+b),0)
          console.log('systems count', systems)
          console.log('planets count', planets)
          console.log('average planets per system', (planets / systems).toFixed(2))
          expect.objectContaining(result)
        })

        // FINALIZE ------------------------------------------------------------
        .finalize((action) => {
          done()
        }, 0)
        .execute()
    }).timeout(60000)
  })

})
