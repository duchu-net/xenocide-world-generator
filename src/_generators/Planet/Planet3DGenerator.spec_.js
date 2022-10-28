// import expect from 'expect'
import assert from 'assert'
import Planet3DGenerator from './Planet3DGenerator'
import SteppedAction from '../../utils/SteppedAction'
var fs = require('fs');



describe('Planet3DGenerator: model', () => {
  describe('Planet asynchronous', () => {
    it ('should generate 10 planets', (done) => {
      const action = new SteppedAction()
      action.progressUpdater = (p) => {
        console.log(p.getCurrentActionName(), (p.getProgress() * 100).toFixed(2) + '%')
      }

      // const planet1 = new Planet3DGenerator()
      // const planet2 = new Planet3DGenerator()
      // const planet3 = new Planet3DGenerator()
      // const planet4 = new Planet3DGenerator()
      // const planet5 = new Planet3DGenerator()
      // const planet6 = new Planet3DGenerator()
      // const planet7 = new Planet3DGenerator()
      // const planet8 = new Planet3DGenerator()
      // const planet9 = new Planet3DGenerator()
      const planet10 = new Planet3DGenerator({
        generationSettings: {
          subdivisions: 21
        }
      })

      action
  		  // .executeSubaction((action) => {
        //   planet1.generatePlanetAsynchronous(action)
        // }, 1)
        // .getResult((result) => {
        //   console.log('getResult1')
        //   expect.objectContaining(result)
        // })
        //
  		  // .executeSubaction((action) => {
        //   planet2.generatePlanetAsynchronous(action)
        // }, 1)
        // .getResult((result) => {
        //   console.log('getResult2')
        //   expect.objectContaining(result)
        // })
        //
  		  // .executeSubaction((action) => {
        //   planet3.generatePlanetAsynchronous(action)
        // }, 1)
        // .getResult((result) => {
        //   console.log('getResult3')
        //   expect.objectContaining(result)
        // })
        //
  		  // .executeSubaction((action) => {
        //   planet4.generatePlanetAsynchronous(action)
        // }, 1)
        // .getResult((result) => {
        //   console.log('getResult4')
        //   expect.objectContaining(result)
        // })
        //
        // // 5 -------------------------------------------------------------------
  		  // .executeSubaction((action) => {
        //   planet5.generatePlanetAsynchronous(action)
        // }, 1)
        // .getResult((result) => {
        //   console.log('getResult5')
        //   expect.objectContaining(result)
        // })
        //
  		  // .executeSubaction((action) => {
        //   planet6.generatePlanetAsynchronous(action)
        // }, 1)
        // .getResult((result) => {
        //   console.log('getResult6')
        //   expect.objectContaining(result)
        // })
        //
        // // 7 -------------------------------------------------------------------
  		  // .executeSubaction((action) => {
        //   planet7.generatePlanetAsynchronous(action)
        // }, 1)
        // .getResult((result) => {
        //   console.log('getResult7')
        //   expect.objectContaining(result)
        // })
        //
  		  // .executeSubaction((action) => {
        //   planet8.generatePlanetAsynchronous(action)
        // }, 1)
        // .getResult((result) => {
        //   console.log('getResult8')
        //   expect.objectContaining(result)
        // })
        //
  		  // .executeSubaction((action) => {
        //   planet9.generatePlanetAsynchronous(action)
        // }, 1)
        // .getResult((result) => {
        //   console.log('getResult9')
        //   expect.objectContaining(result)
        // })

        // 10 ------------------------------------------------------------------
  		  .executeSubaction((action) => {
          planet10.generatePlanetAsynchronous(action)
        }, 1)
        .getResult((result) => {
          // console.log('getResult10', Object.keys(result), Object.keys(result.renderData.surface))
          const length = result.topology.tiles.length
          // var json = JSON.stringify({
          //   // mesh: result.mesh,
          //   topology: result.topology,
          //   partition: result.partition
          // }, 0, 2);
          // fs.writeFile(`tiles-${length}.json`, json, 'utf8', () => console.log('save done!'));
          var jsonTopology = JSON.stringify(result.topology);
          fs.writeFile(`${length}-topology.json`, jsonTopology, 'utf8', () => console.log('save done!'));

          var jsonGeometry = JSON.stringify(result.renderData.surface.geometry);
          fs.writeFile(`${length}-geometry.json`, jsonGeometry, 'utf8', () => console.log('save done!'))
          var jsonPlanetObject = JSON.stringify(result.renderData.surface.renderObject);
          fs.writeFile(`${length}-planet-object.json`, jsonPlanetObject, 'utf8', () => console.log('save done!'))
          // var jsonMapObject = JSON.stringify(result.renderData.surface.renderObject);
          // fs.writeFile(`${length}map-object.json`, jsonMapObject, 'utf8', () => console.log('save done!'))
          // expect.objectContaining(result)
          assert.ok(typeof result == 'object')
        })

        // FINALIZE ------------------------------------------------------------
        .finalize((action) => {
          console.warn('FINISH!!! :D');
          done()
        }, 0)
        .execute()

      // Promise.resolve()
      //   .then(() => planet.generatePlanetAsynchronous(action))
      //   .then((result) => {
      //     // console.log('res', result)
      //     console.log('res')
      //   })
    }).timeout(60000)
  })

})
