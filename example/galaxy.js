const { Galaxy } = require('../lib/library')

// const galaxy = new Galaxy() // Random shape
const galaxy = new Galaxy({ classification: 'grid', buildData: { gridOptions: [100, 30] } }) // Grid shape with [size, spacing] 
// const galaxy = new Galaxy({ classification: 'spiral' }) // Spiral shape

console.log('*** Galaxy generated:', galaxy.name, galaxy.code)
for (let system of galaxy.generateSystems()) {
  // await system.build()
  console.log('** System generated:', system.name, system.code)
  for (let star of system.generateStars()) {
    console.log('* Star generated:', star.designation, star.code)
  }
  for (let planet of system.generatePlanets()) {
    console.log('* Planet generated:', planet.designation, planet.code)
  }
}
console.log(galaxy.statistics)
