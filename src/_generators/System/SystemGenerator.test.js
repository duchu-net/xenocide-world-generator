import expect from 'expect'
import SystemGenerator from './SystemGenerator'
import { SteppedAction } from 'duchunet-utils'


describe('SystemGenerator: model', () => {
  describe('system asynchronous', () => {
    it ('should generate 2 systems', (done) => {
      const action = new SteppedAction()
      action.progressUpdater = (p) => {
        console.log(p.getCurrentActionName(), (p.getProgress() * 100).toFixed(2) + '%')
      }


      action
  		  .executeSubaction((action) => {
          const system = new SystemGenerator({ model: { seed: 'dupa' } })
          system.generate(action)
        }, 1)
        .getResult((result) => {
          // console.log('generateSystem result', result)
          expect.objectContaining(result)
        })

  		  .executeSubaction((action) => {
          const system = new SystemGenerator()
          system.generate(action)
        }, 1)
        .getResult((result) => {
          // console.log('generateSystem result', result)
          expect.objectContaining(result)
        })

        // FINALIZE ------------------------------------------------------------
        .finalize((action) => {
          done()
        }, 0)
        .execute()
    }).timeout(10000)
  })

})
