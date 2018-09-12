import * as THREE from 'three-math'
// import SteppedAction from './helpers/stepped-action'
// import { SteppedAction } from 'duchunet-utils'
import SteppedAction from '../../utils/SteppedAction'
import XorShift128 from './helpers/xor-shift128'
import { hashString, adjustRange, slerp, calculateTriangleArea, randomUnitVector } from './helpers/functions'
import Tile from './Tile'
import Corner from './Corner'
import Border from './Border'
import Plate from './Plate'
import SpatialPartition from './SpatialPartition'
import Generator from '../Generator'


class Planet3DGenerator extends Generator {
  static defaultProps = {
    generationSettings: {
      subdivisions: 20, //detail_level
      distortionLevel: 100, // CONST?? --- |
      plateCount: 7,
      oceanicRate: 70 / 100,
      heatLevel: 1 / 100 + 1,
      moistureLevel: 1 / 100 + 1,
      seed: 'xyz',
      type: 'earth',
    }
  }

  planet = {}
  // generationSettings = {
  //   subdivisions: 20, //detail_level
  //   distortionLevel: 100, // CONST?? --- |
  //   plateCount: 7,
  //   oceanicRate: 70 / 100,
  //   heatLevel: 1 / 100 + 1,
  //   moistureLevel: 1 / 100 + 1,
  //   seed: 'xyz',
  //   type: 'earth',
  // }
  projectionRenderMode = 'globe'
  surfaceRenderMode = 'terrain'
  renderSunlight = true
  renderPlateBoundaries = false
  renderPlateMovements = false
  renderAirCurrents = false

  activeAction = null
  tileSelection = null
  sunTimeOffset = 0

  constructor(props = {}) {
    super(props)
    // console.log(this.props);
  }


  //##########################################################################
	generatePlanetAsynchronous(action) {
    let selfExecute = false
    if (action == null || !action instanceof SteppedAction) {
      selfExecute = true
      action = new SteppedAction((action) => {
        console.log('SteppedAction from Planet3DGenerator')
        // console.log('Planet3DGenerator_action', action)  /*updateProgressUI*/
      })
    }

    // console.log('generatePlanetAsynchronous', this.props)
    const { generationSettings } = this.props
    const { subdivisions, distortionLevel } = generationSettings

    let planet = {}

		let distortionRate = null
		if (distortionLevel < 0.25)
			distortionRate = adjustRange(distortionLevel, 0.00, 0.25, 0.000, 0.040)
		else if (distortionLevel < 0.50)
			distortionRate = adjustRange(distortionLevel, 0.25, 0.50, 0.040, 0.050)
		else if (distortionLevel < 0.75)
			distortionRate = adjustRange(distortionLevel, 0.50, 0.75, 0.050, 0.075)
		else
			distortionRate = adjustRange(distortionLevel, 0.75, 1.00, 0.075, 0.150)

		const originalSeed = generationSettings.seed
		let seed = null
		if (typeof (originalSeed) === "number")
			seed = originalSeed
		else if (typeof (originalSeed) === "string")
			seed = hashString(originalSeed)
		else
			seed = Date.now()
		const random = new XorShift128(seed)

		const plateCount = generationSettings.plateCount
		const oceanicRate = generationSettings.oceanicRate
		const heatLevel = generationSettings.heatLevel
		const moistureLevel = generationSettings.moistureLevel

    this.activeAction = action
		// this.activeAction = new SteppedAction((action) => {
    //     // console.log('Planet3DGenerator_action', action)  /*updateProgressUI*/
    //   })


    const generateAction = action
		  // .executeSubaction((action) => {
      //   //ui.progressPanel.show()
      // }, 0)
      .executeSubaction((action) => {
        this.generatePlanet(subdivisions, distortionRate, plateCount, oceanicRate, heatLevel, moistureLevel, random, action)
      }, 1, "Generating Planet")
      .getResult((result) => {
        planet = result
        planet.seed = seed
        planet.originalSeed = originalSeed
      })
      .executeSubaction((action) => {
        // this.displayPlanet(planet)
        // this.setSeed(null)
        console.warn('FINISH!!! :D', Object.keys(planet))
        this.activeAction = null
      })
      .provideResult(() => planet)

      // .finalize((action) => {
      //   console.warn('FINISH!!! :D');
      //   this.activeAction = null
      //   //ui.progressPanel.hide()
      //   resolve(planet)
      // }, 0)
      // .execute()
    // })

    if (selfExecute) return generateAction.execute()
    // return generateAction
  }



  generatePlanet(icosahedronSubdivision, topologyDistortionRate, plateCount, oceanicRate, heatLevel, moistureLevel, random, action){
  	const { planet } = this //new Planet();
  	let mesh
  	action
      .executeSubaction((action) => {
        this.generatePlanetMesh(icosahedronSubdivision, topologyDistortionRate, random, action);
      }, 6, "Generating Mesh")
      .getResult((result) => {
        planet.mesh = result
        // console.log('mesh', result)
      })

      .executeSubaction((action) => {
        this.generatePlanetTopology(planet.mesh, action);
      }, 1, "Generating Topology")
      .getResult( (result) => {
        planet.topology = result;
      })

      .executeSubaction((action) => {
        this.generatePlanetPartition(planet.topology.tiles, action);
      }, 1, "Generating Spatial Partitions")
      .getResult((result) => {
      	// console.log("planet.partition", result);
        planet.partition = result
      })

      .executeSubaction((action) => {
        this.generatePlanetTerrain(planet, plateCount, oceanicRate, heatLevel, moistureLevel, random, action);
      }, 8, "Generating Terrain")
      .executeSubaction((action) => {
        // this.generatePlanetRenderData(planet.topology, random, action);
      }, 1, "Building Visuals")
      .getResult((result) => {
      	planet.renderData = result
      })

      .executeSubaction((action) => {
        // this.generatePlanetStatistics(planet.topology, planet.plates, action);
      }, 1, "Compiling Statistics")
      .getResult((result) => {
        // planet.statistics = result;
        //console.log('$planet obiekt planety:');
        // console.log(planet);
      })

      .provideResult(planet)
  }



  generatePlanetMesh(icosahedronSubdivision, topologyDistortionRate, random, action){
    	var mesh;
    	action.executeSubaction( (action) => {
    			mesh = this.generateSubdividedIcosahedron(icosahedronSubdivision);
    	}, 1, "Generating Subdivided Icosahedron");

    	action.executeSubaction( (action) => {
    			var totalDistortion = Math.ceil(mesh.edges.length * topologyDistortionRate);
    			var remainingIterations = 6;
    			action.executeSubaction( (action) => {
    					var iterationDistortion = Math.floor(totalDistortion / remainingIterations);
    					totalDistortion -= iterationDistortion;
    					action.executeSubaction( (action) => {
    							this.distortMesh(mesh, iterationDistortion, random, action);
    					});
    					action.executeSubaction( (action) => {
    							this.relaxMesh(mesh, 0.5, action);
    					});
    					--remainingIterations;
    					if (remainingIterations > 0)
    						action.loop(1 - remainingIterations / 6);
    			});
    	}, 15, "Distorting Triangle Mesh");

    	action.executeSubaction( (action) => {
    			var initialIntervalIteration = action.intervalIteration;

    			var averageNodeRadius = Math.sqrt(4 * Math.PI / mesh.nodes.length);
    			var minShiftDelta = averageNodeRadius / 50000 * mesh.nodes.length;
    			var maxShiftDelta = averageNodeRadius / 50 * mesh.nodes.length;

    			var priorShift;
    			var currentShift = this.relaxMesh(mesh, 0.5, action);
    			action.executeSubaction( (action) => {
    					priorShift = currentShift;
    					currentShift = this.relaxMesh(mesh, 0.5, action);
    					var shiftDelta = Math.abs(currentShift - priorShift);
    					if (shiftDelta >= minShiftDelta && action.intervalIteration - initialIntervalIteration < 300){
    						action.loop(Math.pow(Math.max(0, (maxShiftDelta - shiftDelta) / (maxShiftDelta - minShiftDelta)), 4));
    					}
    			});
    	}, 25, "Relaxing Triangle Mesh");

    	action.executeSubaction( (action) => {
    			for (var i = 0; i < mesh.faces.length; ++i){
    				var face = mesh.faces[i];
    				var p0 = mesh.nodes[face.n[0]].p;
    				var p1 = mesh.nodes[face.n[1]].p;
    				var p2 = mesh.nodes[face.n[2]].p;
    				face.centroid = this.calculateFaceCentroid(p0, p1, p2).normalize();
    			}
    	}, 1, "Calculating Triangle Centroids");

    	action.executeSubaction( (action) => {
    			for (var i = 0; i < mesh.nodes.length; ++i){
    				var node = mesh.nodes[i];
    				var faceIndex = node.f[0];
    				for (var j = 1; j < node.f.length - 1; ++j){
    					faceIndex = this.findNextFaceIndex(mesh, i, faceIndex);
    					var k = node.f.indexOf(faceIndex);
    					node.f[k] = node.f[j];
    					node.f[j] = faceIndex;
    				}
    			}
    	}, 1, "Reordering Triangle Nodes");

    	action.provideResult(function () {
    			return mesh;
    	});
    }

    //##########################################################################
    generateSubdividedIcosahedron(degree){
    	var icosahedron = this.generateIcosahedron();

    	var nodes = [];
    	for (var i = 0; i < icosahedron.nodes.length; ++i){
    		nodes.push({p: icosahedron.nodes[i].p, e: [], f: []});
    	}

    	var edges = [];
    	for (var i = 0; i < icosahedron.edges.length; ++i){
    		var edge = icosahedron.edges[i];
    		edge.subdivided_n = [];
    		edge.subdivided_e = [];
    		var n0 = icosahedron.nodes[edge.n[0]];
    		var n1 = icosahedron.nodes[edge.n[1]];
    		var p0 = n0.p;
    		var p1 = n1.p;
    		var delta = p1.clone().sub(p0);
    		nodes[edge.n[0]].e.push(edges.length);
    		var priorNodeIndex = edge.n[0];
    		for (var s = 1; s < degree; ++s){
    			var edgeIndex = edges.length;
    			var nodeIndex = nodes.length;
    			edge.subdivided_e.push(edgeIndex);
    			edge.subdivided_n.push(nodeIndex);
    			edges.push({n: [priorNodeIndex, nodeIndex], f: []});
    			priorNodeIndex = nodeIndex;
    			nodes.push({p: slerp(p0, p1, s / degree), e: [edgeIndex, edgeIndex + 1], f: []});
    		}
    		edge.subdivided_e.push(edges.length);
    		nodes[edge.n[1]].e.push(edges.length);
    		edges.push({n: [priorNodeIndex, edge.n[1]], f: []});
    	}

    	var faces = [];
    	for (var i = 0; i < icosahedron.faces.length; ++i){
    		var face = icosahedron.faces[i];
    		var edge0 = icosahedron.edges[face.e[0]];
    		var edge1 = icosahedron.edges[face.e[1]];
    		var edge2 = icosahedron.edges[face.e[2]];
    		var point0 = icosahedron.nodes[face.n[0]].p;
    		var point1 = icosahedron.nodes[face.n[1]].p;
    		var point2 = icosahedron.nodes[face.n[2]].p;
    		var delta = point1.clone().sub(point0);

    		var getEdgeNode0 = (face.n[0] === edge0.n[0])
    		? function (k) {
    			return edge0.subdivided_n[k];
    		}
    		: function (k) {
    			return edge0.subdivided_n[degree - 2 - k];
    		};
    		var getEdgeNode1 = (face.n[1] === edge1.n[0])
    		? function (k) {
    			return edge1.subdivided_n[k];
    		}
    		: function (k) {
    			return edge1.subdivided_n[degree - 2 - k];
    		};
    		var getEdgeNode2 = (face.n[0] === edge2.n[0])
    		? function (k) {
    			return edge2.subdivided_n[k];
    		}
    		: function (k) {
    			return edge2.subdivided_n[degree - 2 - k];
    		};

    		var faceNodes = [];
    		faceNodes.push(face.n[0]);
    		for (var j = 0; j < edge0.subdivided_n.length; ++j)
    			faceNodes.push(getEdgeNode0(j));
    		faceNodes.push(face.n[1]);
    		for (var s = 1; s < degree; ++s){
    			faceNodes.push(getEdgeNode2(s - 1));
    			var p0 = nodes[getEdgeNode2(s - 1)].p;
    			var p1 = nodes[getEdgeNode1(s - 1)].p;
    			for (var t = 1; t < degree - s; ++t){
    				faceNodes.push(nodes.length);
    				nodes.push({p: slerp(p0, p1, t / (degree - s)), e: [], f: [], });
    			}
    			faceNodes.push(getEdgeNode1(s - 1));
    		}
    		faceNodes.push(face.n[2]);

    		var getEdgeEdge0 = (face.n[0] === edge0.n[0])
    		? function (k) {
    			return edge0.subdivided_e[k];
    		}
    		: function (k) {
    			return edge0.subdivided_e[degree - 1 - k];
    		};
    		var getEdgeEdge1 = (face.n[1] === edge1.n[0])
    		? function (k) {
    			return edge1.subdivided_e[k];
    		}
    		: function (k) {
    			return edge1.subdivided_e[degree - 1 - k];
    		};
    		var getEdgeEdge2 = (face.n[0] === edge2.n[0])
    		? function (k) {
    			return edge2.subdivided_e[k];
    		}
    		: function (k) {
    			return edge2.subdivided_e[degree - 1 - k];
    		};

    		var faceEdges0 = [];
    		for (var j = 0; j < degree; ++j)
    			faceEdges0.push(getEdgeEdge0(j));
    		var nodeIndex = degree + 1;
    		for (var s = 1; s < degree; ++s){
    			for (var t = 0; t < degree - s; ++t){
    				faceEdges0.push(edges.length);
    				var edge = {n: [faceNodes[nodeIndex], faceNodes[nodeIndex + 1], ], f: [], };
    				nodes[edge.n[0]].e.push(edges.length);
    				nodes[edge.n[1]].e.push(edges.length);
    				edges.push(edge);
    				++nodeIndex;
    			}
    			++nodeIndex;
    		}

    		var faceEdges1 = [];
    		nodeIndex = 1;
    		for (var s = 0; s < degree; ++s){
    			for (var t = 1; t < degree - s; ++t){
    				faceEdges1.push(edges.length);
    				var edge = {n: [faceNodes[nodeIndex], faceNodes[nodeIndex + degree - s], ], f: [], };
    				nodes[edge.n[0]].e.push(edges.length);
    				nodes[edge.n[1]].e.push(edges.length);
    				edges.push(edge);
    				++nodeIndex;
    			}
    			faceEdges1.push(getEdgeEdge1(s));
    			nodeIndex += 2;
    		}

    		var faceEdges2 = [];
    		nodeIndex = 1;
    		for (var s = 0; s < degree; ++s){
    			faceEdges2.push(getEdgeEdge2(s));
    			for (var t = 1; t < degree - s; ++t){
    				faceEdges2.push(edges.length);
    				var edge = {n: [faceNodes[nodeIndex], faceNodes[nodeIndex + degree - s + 1], ], f: [], };
    				nodes[edge.n[0]].e.push(edges.length);
    				nodes[edge.n[1]].e.push(edges.length);
    				edges.push(edge);
    				++nodeIndex;
    			}
    			nodeIndex += 2;
    		}

    		nodeIndex = 0;
    		edgeIndex = 0;
    		for (var s = 0; s < degree; ++s){
    			for (t = 1; t < degree - s + 1; ++t){
    				var subFace = {
    					n: [faceNodes[nodeIndex], faceNodes[nodeIndex + 1], faceNodes[nodeIndex + degree - s + 1], ],
    					e: [faceEdges0[edgeIndex], faceEdges1[edgeIndex], faceEdges2[edgeIndex], ],
                    };
                    nodes[subFace.n[0]].f.push(faces.length);
                    nodes[subFace.n[1]].f.push(faces.length);
                    nodes[subFace.n[2]].f.push(faces.length);
                    edges[subFace.e[0]].f.push(faces.length);
                    edges[subFace.e[1]].f.push(faces.length);
                    edges[subFace.e[2]].f.push(faces.length);
                    faces.push(subFace);
                    ++nodeIndex;
                    ++edgeIndex;
                }
                ++nodeIndex;
            }

            nodeIndex = 1;
            edgeIndex = 0;
            for (var s = 1; s < degree; ++s){
            	for (t = 1; t < degree - s + 1; ++t){
            		var subFace = {
            			n: [faceNodes[nodeIndex], faceNodes[nodeIndex + degree - s + 2], faceNodes[nodeIndex + degree - s + 1], ],
            			e: [faceEdges2[edgeIndex + 1], faceEdges0[edgeIndex + degree - s + 1], faceEdges1[edgeIndex], ],
                    };
                    nodes[subFace.n[0]].f.push(faces.length);
                    nodes[subFace.n[1]].f.push(faces.length);
                    nodes[subFace.n[2]].f.push(faces.length);
                    edges[subFace.e[0]].f.push(faces.length);
                    edges[subFace.e[1]].f.push(faces.length);
                    edges[subFace.e[2]].f.push(faces.length);
                    faces.push(subFace);
                    ++nodeIndex;
                    ++edgeIndex;
                }
                nodeIndex += 2;
                edgeIndex += 1;
            }
        }
        return {nodes: nodes, edges: edges, faces: faces};
    }

    //##########################################################################
	generateIcosahedron(){
		var phi = (1.0 + Math.sqrt(5.0)) / 2.0;
		var du = 1.0 / Math.sqrt(phi * phi + 1.0);
		var dv = phi * du;

		var nodes =
		[
			{p: new THREE.Vector3(0, +dv, +du), e: [], f: []},
			{p: new THREE.Vector3(0, +dv, -du), e: [], f: []},
			{p: new THREE.Vector3(0, -dv, +du), e: [], f: []},
			{p: new THREE.Vector3(0, -dv, -du), e: [], f: []},
			{p: new THREE.Vector3(+du, 0, +dv), e: [], f: []},
			{p: new THREE.Vector3(-du, 0, +dv), e: [], f: []},
			{p: new THREE.Vector3(+du, 0, -dv), e: [], f: []},
			{p: new THREE.Vector3(-du, 0, -dv), e: [], f: []},
			{p: new THREE.Vector3(+dv, +du, 0), e: [], f: []},
			{p: new THREE.Vector3(+dv, -du, 0), e: [], f: []},
			{p: new THREE.Vector3(-dv, +du, 0), e: [], f: []},
			{p: new THREE.Vector3(-dv, -du, 0), e: [], f: []},
		];

		var edges =
		[
			{n: [0, 1, ], f: [], },
			{n: [0, 4, ], f: [], },
			{n: [0, 5, ], f: [], },
			{n: [0, 8, ], f: [], },
			{n: [0, 10, ], f: [], },
			{n: [1, 6, ], f: [], },
			{n: [1, 7, ], f: [], },
			{n: [1, 8, ], f: [], },
			{n: [1, 10, ], f: [], },
			{n: [2, 3, ], f: [], },
			{n: [2, 4, ], f: [], },
			{n: [2, 5, ], f: [], },
			{n: [2, 9, ], f: [], },
			{n: [2, 11, ], f: [], },
			{n: [3, 6, ], f: [], },
			{n: [3, 7, ], f: [], },
			{n: [3, 9, ], f: [], },
			{n: [3, 11, ], f: [], },
			{n: [4, 5, ], f: [], },
			{n: [4, 8, ], f: [], },
			{n: [4, 9, ], f: [], },
			{n: [5, 10, ], f: [], },
			{n: [5, 11, ], f: [], },
			{n: [6, 7, ], f: [], },
			{n: [6, 8, ], f: [], },
			{n: [6, 9, ], f: [], },
			{n: [7, 10, ], f: [], },
			{n: [7, 11, ], f: [], },
			{n: [8, 9, ], f: [], },
			{n: [10, 11, ], f: [], },
		];

		var faces =
		[
			{n: [0, 1, 8], e: [0, 7, 3], },
			{n: [0, 4, 5], e: [1, 18, 2], },
			{n: [0, 5, 10], e: [2, 21, 4], },
			{n: [0, 8, 4], e: [3, 19, 1], },
			{n: [0, 10, 1], e: [4, 8, 0], },
			{n: [1, 6, 8], e: [5, 24, 7], },
			{n: [1, 7, 6], e: [6, 23, 5], },
			{n: [1, 10, 7], e: [8, 26, 6], },
			{n: [2, 3, 11], e: [9, 17, 13], },
			{n: [2, 4, 9], e: [10, 20, 12], },
			{n: [2, 5, 4], e: [11, 18, 10], },
			{n: [2, 9, 3], e: [12, 16, 9], },
			{n: [2, 11, 5], e: [13, 22, 11], },
			{n: [3, 6, 7], e: [14, 23, 15], },
			{n: [3, 7, 11], e: [15, 27, 17], },
			{n: [3, 9, 6], e: [16, 25, 14], },
			{n: [4, 8, 9], e: [19, 28, 20], },
			{n: [5, 11, 10], e: [22, 29, 21], },
			{n: [6, 9, 8], e: [25, 28, 24], },
			{n: [7, 10, 11], e: [26, 29, 27], },
		];

		for (var i = 0; i < edges.length; ++i)
			for (var j = 0; j < edges[i].n.length; ++j)
            nodes[j].e.push(i);

        for (var i = 0; i < faces.length; ++i)
        	for (var j = 0; j < faces[i].n.length; ++j)
            nodes[j].f.push(i);

        for (var i = 0; i < faces.length; ++i)
        	for (var j = 0; j < faces[i].e.length; ++j)
            edges[j].f.push(i);

        return {nodes: nodes, edges: edges, faces: faces};
    }

    //##########################################################################
    distortMesh(mesh, degree, random, action){
    	var totalSurfaceArea = 4 * Math.PI;
    	var idealFaceArea = totalSurfaceArea / mesh.faces.length;
    	var idealEdgeLength = Math.sqrt(idealFaceArea * 4 / Math.sqrt(3));
    	var idealFaceHeight = idealEdgeLength * Math.sqrt(3) / 2;

    	var rotationPredicate = function (oldNode0, oldNode1, newNode0, newNode1){
    		if (newNode0.f.length >= 7 || newNode1.f.length >= 7 || oldNode0.f.length <= 5 || oldNode1.f.length <= 5)
    			return false;
            var oldEdgeLength = oldNode0.p.distanceTo(oldNode1.p);
            var newEdgeLength = newNode0.p.distanceTo(newNode1.p);
            var ratio = oldEdgeLength / newEdgeLength;
            if (ratio >= 2 || ratio <= 0.5)
            	return false;
            var v0 = oldNode1.p.clone().sub(oldNode0.p).divideScalar(oldEdgeLength);
            var v1 = newNode0.p.clone().sub(oldNode0.p).normalize();
            var v2 = newNode1.p.clone().sub(oldNode0.p).normalize();
            if (v0.dot(v1) < 0.2 || v0.dot(v2) < 0.2)
            	return false;
            v0.negate();
            var v3 = newNode0.p.clone().sub(oldNode1.p).normalize();
            var v4 = newNode1.p.clone().sub(oldNode1.p).normalize();
            if (v0.dot(v3) < 0.2 || v0.dot(v4) < 0.2)
            	return false;
            return true;
        };

        var i = 0;
        action.executeSubaction( (action) => {
        		if (i >= degree)
        			return;

        		var consecutiveFailedAttempts = 0;
        		var edgeIndex = random.integerExclusive(0, mesh.edges.length);
        		while (!this.conditionalRotateEdge(mesh, edgeIndex, rotationPredicate)){
        			if (++consecutiveFailedAttempts >= mesh.edges.length)
        				return false;
        			edgeIndex = (edgeIndex + 1) % mesh.edges.length;
        		}

        		++i;
        		action.loop(i / degree);
        });
        return true;
    }

    //##########################################################################
    relaxMesh(mesh, multiplier, action){
    	var totalSurfaceArea = 4 * Math.PI;
    	var idealFaceArea = totalSurfaceArea / mesh.faces.length;
    	var idealEdgeLength = Math.sqrt(idealFaceArea * 4 / Math.sqrt(3));
    	var idealDistanceToCentroid = idealEdgeLength * Math.sqrt(3) / 3 * 0.9;

    	var pointShifts = new Array(mesh.nodes.length);
    	action.executeSubaction(function (action){
    			for (var i = 0; i < mesh.nodes.length; ++i)
    				pointShifts[i] = new THREE.Vector3(0, 0, 0);
    	}, 1);

    	var i = 0;
    	action.executeSubaction( (action) => {
    			if (i >= mesh.faces.length)
    				return;

    			var face = mesh.faces[i];
    			var n0 = mesh.nodes[face.n[0]];
    			var n1 = mesh.nodes[face.n[1]];
    			var n2 = mesh.nodes[face.n[2]];
    			var p0 = n0.p;
    			var p1 = n1.p;
    			var p2 = n2.p;
    			var e0 = p1.distanceTo(p0) / idealEdgeLength;
    			var e1 = p2.distanceTo(p1) / idealEdgeLength;
    			var e2 = p0.distanceTo(p2) / idealEdgeLength;
    			var centroid = this.calculateFaceCentroid(p0, p1, p2).normalize();
    			var v0 = centroid.clone().sub(p0);
    			var v1 = centroid.clone().sub(p1);
    			var v2 = centroid.clone().sub(p2);
    			var length0 = v0.length();
    			var length1 = v1.length();
    			var length2 = v2.length();
    			v0.multiplyScalar(multiplier * (length0 - idealDistanceToCentroid) / length0);
    			v1.multiplyScalar(multiplier * (length1 - idealDistanceToCentroid) / length1);
    			v2.multiplyScalar(multiplier * (length2 - idealDistanceToCentroid) / length2);
    			pointShifts[face.n[0]].add(v0);
    			pointShifts[face.n[1]].add(v1);
    			pointShifts[face.n[2]].add(v2);

    			++i;
    			action.loop(i / mesh.faces.length);
    	}, mesh.faces.length);

    	var origin = new THREE.Vector3(0, 0, 0);
    	var plane = new THREE.Plane();
    	action.executeSubaction(function (action){
    			for (var i = 0; i < mesh.nodes.length; ++i){
    				plane.setFromNormalAndCoplanarPoint(mesh.nodes[i].p, origin);
    				pointShifts[i] = mesh.nodes[i].p.clone().add(plane.projectPoint(pointShifts[i])).normalize();
    			}
    	}, mesh.nodes.length / 10);

    	var rotationSupressions = new Array(mesh.nodes.length);
    	for (var i = 0; i < mesh.nodes.length; ++i)
    		rotationSupressions[i] = 0;

    	var i = 0;
    	action.executeSubaction(function (action){
    			if (i >= mesh.edges.length)
    				return;

    			var edge = mesh.edges[i];
    			var oldPoint0 = mesh.nodes[edge.n[0]].p;
    			var oldPoint1 = mesh.nodes[edge.n[1]].p;
    			var newPoint0 = pointShifts[edge.n[0]];
    			var newPoint1 = pointShifts[edge.n[1]];
    			var oldVector = oldPoint1.clone().sub(oldPoint0).normalize();
    			var newVector = newPoint1.clone().sub(newPoint0).normalize();
    			var suppression = (1 - oldVector.dot(newVector)) * 0.5;
    			rotationSupressions[edge.n[0]] = Math.max(rotationSupressions[edge.n[0]], suppression);
    			rotationSupressions[edge.n[1]] = Math.max(rotationSupressions[edge.n[1]], suppression);

    			++i;
    			action.loop(i / mesh.edges.length);
    	});

    	var totalShift = 0;
    	action.executeSubaction(function (action){
    			for (var i = 0; i < mesh.nodes.length; ++i){
    				var node = mesh.nodes[i];
    				var point = node.p;
    				var delta = point.clone();
    				point.lerp(pointShifts[i], 1 - Math.sqrt(rotationSupressions[i])).normalize();
    				delta.sub(point);
    				totalShift += delta.length();
    			}
    	}, mesh.nodes.length / 20);
    	return totalShift;
    }

    //##########################################################################
    conditionalRotateEdge(mesh, edgeIndex, predicate){
    	var edge = mesh.edges[edgeIndex];
    	var face0 = mesh.faces[edge.f[0]];
    	var face1 = mesh.faces[edge.f[1]];
    	var farNodeFaceIndex0 = this.getFaceOppositeNodeIndex(face0, edge);
    	var farNodeFaceIndex1 = this.getFaceOppositeNodeIndex(face1, edge);
    	var newNodeIndex0 = face0.n[farNodeFaceIndex0];
    	var oldNodeIndex0 = face0.n[(farNodeFaceIndex0 + 1) % 3];
    	var newNodeIndex1 = face1.n[farNodeFaceIndex1];
    	var oldNodeIndex1 = face1.n[(farNodeFaceIndex1 + 1) % 3];
    	var oldNode0 = mesh.nodes[oldNodeIndex0];
    	var oldNode1 = mesh.nodes[oldNodeIndex1];
    	var newNode0 = mesh.nodes[newNodeIndex0];
    	var newNode1 = mesh.nodes[newNodeIndex1];
    	var newEdgeIndex0 = face1.e[(farNodeFaceIndex1 + 2) % 3];
    	var newEdgeIndex1 = face0.e[(farNodeFaceIndex0 + 2) % 3];
    	var newEdge0 = mesh.edges[newEdgeIndex0];
    	var newEdge1 = mesh.edges[newEdgeIndex1];

    	if (!predicate(oldNode0, oldNode1, newNode0, newNode1))
    		return false;

    	oldNode0.e.splice(oldNode0.e.indexOf(edgeIndex), 1);
    	oldNode1.e.splice(oldNode1.e.indexOf(edgeIndex), 1);
    	newNode0.e.push(edgeIndex);
    	newNode1.e.push(edgeIndex);

    	edge.n[0] = newNodeIndex0;
    	edge.n[1] = newNodeIndex1;

    	newEdge0.f.splice(newEdge0.f.indexOf(edge.f[1]), 1);
    	newEdge1.f.splice(newEdge1.f.indexOf(edge.f[0]), 1);
    	newEdge0.f.push(edge.f[0]);
    	newEdge1.f.push(edge.f[1]);

    	oldNode0.f.splice(oldNode0.f.indexOf(edge.f[1]), 1);
    	oldNode1.f.splice(oldNode1.f.indexOf(edge.f[0]), 1);
    	newNode0.f.push(edge.f[1]);
    	newNode1.f.push(edge.f[0]);

    	face0.n[(farNodeFaceIndex0 + 2) % 3] = newNodeIndex1;
    	face1.n[(farNodeFaceIndex1 + 2) % 3] = newNodeIndex0;

    	face0.e[(farNodeFaceIndex0 + 1) % 3] = newEdgeIndex0;
    	face1.e[(farNodeFaceIndex1 + 1) % 3] = newEdgeIndex1;
    	face0.e[(farNodeFaceIndex0 + 2) % 3] = edgeIndex;
    	face1.e[(farNodeFaceIndex1 + 2) % 3] = edgeIndex;

    	return true;
    }

    //##########################################################################
    getFaceOppositeNodeIndex(face, edge){
    	if (face.n[0] !== edge.n[0] && face.n[0] !== edge.n[1])
    		return 0;
    	if (face.n[1] !== edge.n[0] && face.n[1] !== edge.n[1])
    		return 1;
    	if (face.n[2] !== edge.n[0] && face.n[2] !== edge.n[1])
    		return 2;
    	throw "Cannot find node of given face that is not also a node of given edge.";
    }

    calculateFaceCentroid(pa, pb, pc){
    	var vabHalf = pb.clone().sub(pa).divideScalar(2);
    	var pabHalf = pa.clone().add(vabHalf);
    	var centroid = pc.clone().sub(pabHalf).multiplyScalar(1 / 3).add(pabHalf);
    	return centroid;
    }

    findNextFaceIndex(mesh, nodeIndex, faceIndex){
    	var node = mesh.nodes[nodeIndex];
    	var face = mesh.faces[faceIndex];
    	var nodeFaceIndex = face.n.indexOf(nodeIndex);
    	var edge = mesh.edges[face.e[(nodeFaceIndex + 2) % 3]];
    	return this.getEdgeOppositeFaceIndex(edge, faceIndex);
    }

  getEdgeOppositeFaceIndex(edge, faceIndex){
  	if (edge.f[0] === faceIndex)
  		return edge.f[1];
  	if (edge.f[1] === faceIndex)
  		return edge.f[0];
  	throw "Given face is not part of given edge.";
  }
  // ###########################################################################



  // ===========================================================================
  /*
  *   TOPOLOGY
  */
  generatePlanetTopology(mesh, action){
  	var corners = new Array(mesh.faces.length);
  	var borders = new Array(mesh.edges.length);
  	var tiles = new Array(mesh.nodes.length);

  	action.executeSubaction( (action) => {
  			for (var i = 0; i < mesh.faces.length; ++i){
  				var face = mesh.faces[i];
  				corners[i] = new Corner(i, face.centroid.clone().multiplyScalar(1000), face.e.length, face.e.length, face.n.length);
  			}
  	});

  	action.executeSubaction(function (action){
  			for (var i = 0; i < mesh.edges.length; ++i){
  				var edge = mesh.edges[i];
  				borders[i] = new Border(i, 2, 4, 2); //edge.f.length, mesh.faces[edge.f[0]].e.length + mesh.faces[edge.f[1]].e.length - 2, edge.n.length
  			}
  	});

  	action.executeSubaction(function (action){
  			for (var i = 0; i < mesh.nodes.length; ++i){
  				var node = mesh.nodes[i];
  				tiles[i] = new Tile(i, node.p.clone().multiplyScalar(1000), node.f.length, node.e.length, node.e.length);
  			}
  			//console.log('$planet generation');
  			//console.log(tiles);
  	});

  	action.executeSubaction(function (action){
  			for (var i = 0; i < corners.length; ++i){
  				var corner = corners[i];
  				var face = mesh.faces[i];
  				for (var j = 0; j < face.e.length; ++j){
  					corner.borders[j] = borders[face.e[j]];
  				}
  				for (var j = 0; j < face.n.length; ++j){
  					corner.tiles[j] = tiles[face.n[j]];
  				}
  			}
  	});

  	action.executeSubaction(function (action){
  			for (var i = 0; i < borders.length; ++i){
  				var border = borders[i];
  				var edge = mesh.edges[i];
  				var averageCorner = new THREE.Vector3(0, 0, 0);
  				var n = 0;
  				for (var j = 0; j < edge.f.length; ++j){
  					var corner = corners[edge.f[j]]
  					averageCorner.add(corner.position);
  					border.corners[j] = corner;
  					for (var k = 0; k < corner.borders.length; ++k){
  						if (corner.borders[k] !== border)
  							border.borders[n++] = corner.borders[k];
  					}
  				}
  				border.midpoint = averageCorner.multiplyScalar(1 / border.corners.length);
  				for (var j = 0; j < edge.n.length; ++j){
  					border.tiles[j] = tiles[edge.n[j]];
  				}
  			}
  	});

  	action.executeSubaction(function (action){
  			for (var i = 0; i < corners.length; ++i){
  				var corner = corners[i];
  				for (var j = 0; j < corner.borders.length; ++j){
  					corner.corners[j] = corner.borders[j].oppositeCorner(corner);
  				}
  			}
  	});

  	action.executeSubaction( (action) => {
  			for (var i = 0; i < tiles.length; ++i){
  				var tile = tiles[i];
  				var node = mesh.nodes[i];
  				for (var j = 0; j < node.f.length; ++j){
  					tile.corners[j] = corners[node.f[j]];
  				}
  				for (var j = 0; j < node.e.length; ++j){
  					var border = borders[node.e[j]];
  					if (border.tiles[0] === tile){
  						for (var k = 0; k < tile.corners.length; ++k){
  							var corner0 = tile.corners[k];
  							var corner1 = tile.corners[(k + 1) % tile.corners.length];
  							if (border.corners[1] === corner0 && border.corners[0] === corner1){
  								border.corners[0] = corner0;
  								border.corners[1] = corner1;
  							} else if (border.corners[0] !== corner0 || border.corners[1] !== corner1){
  								continue;
  							}
  							tile.borders[k] = border;
  							tile.tiles[k] = border.oppositeTile(tile);
  							break;
  						}
  					} else{
  						for (var k = 0; k < tile.corners.length; ++k){
  							var corner0 = tile.corners[k];
  							var corner1 = tile.corners[(k + 1) % tile.corners.length];
  							if (border.corners[0] === corner0 && border.corners[1] === corner1){
  								border.corners[1] = corner0;
  								border.corners[0] = corner1;
  							} else if (border.corners[1] !== corner0 || border.corners[0] !== corner1){
  								continue;
  							}
  							tile.borders[k] = border;
  							tile.tiles[k] = border.oppositeTile(tile);
  							break;
  						}
  					}
  				}

  				tile.averagePosition = new THREE.Vector3(0, 0, 0);
  				for (var j = 0; j < tile.corners.length; ++j){
  					tile.averagePosition.add(tile.corners[j].position);
  				}
  				tile.averagePosition.multiplyScalar(1 / tile.corners.length);

  				var maxDistanceToCorner = 0;
  				for (var j = 0; j < tile.corners.length; ++j){
  					maxDistanceToCorner = Math.max(maxDistanceToCorner, tile.corners[j].position.distanceTo(tile.averagePosition));
  				}

  				var area = 0;
  				for (var j = 0; j < tile.borders.length; ++j){
  					area += calculateTriangleArea(tile.position, tile.borders[j].corners[0].position, tile.borders[j].corners[1].position);
  				}
  				tile.area = area;
  				tile.normal = tile.position.clone().normalize();
  				tile.boundingSphere = new THREE.Sphere(tile.averagePosition, maxDistanceToCorner);
  			}
  	});

  	action.executeSubaction(function (action){
  			for (var i = 0; i < corners.length; ++i){
  				var corner = corners[i];
  				corner.area = 0;
  				for (var j = 0; j < corner.tiles.length; ++j){
  					corner.area += corner.tiles[j].area / corner.tiles[j].corners.length;
  				}
  			}
  	});
  	action.provideResult({ corners: corners, borders: borders, tiles: tiles });
  }
  // END TOPOLOGY ============================================================



  // ===========================================================================
  /*
  *   PARTITION
  */
  generatePlanetPartition(tiles, action){
  	var icosahedron = this.generateIcosahedron();
  	action.executeSubaction(function (action){
  			for (var i = 0; i < icosahedron.faces.length; ++i){
  				var face = icosahedron.faces[i];
  				var p0 = icosahedron.nodes[face.n[0]].p.clone().multiplyScalar(1000);
  				var p1 = icosahedron.nodes[face.n[1]].p.clone().multiplyScalar(1000);
  				var p2 = icosahedron.nodes[face.n[2]].p.clone().multiplyScalar(1000);
  				var center = p0.clone().add(p1).add(p2).divideScalar(3);
  				var radius = Math.max(center.distanceTo(p0), center.distanceTo(p2), center.distanceTo(p2));
  				face.boundingSphere = new THREE.Sphere(center, radius);
  				face.children = [];
  			}
  	});

  	var unparentedTiles = [];
  	var maxDistanceFromOrigin = 0;
  	action.executeSubaction(function (action){
  			for (var i = 0; i < tiles.length; ++i){
  				var tile = tiles[i];
  				maxDistanceFromOrigin = Math.max(maxDistanceFromOrigin, tile.boundingSphere.center.length() + tile.boundingSphere.radius);

  				var parentFound = false;
  				for (var j = 0; j < icosahedron.faces.length; ++j){
  					var face = icosahedron.faces[j];
  					var distance = tile.boundingSphere.center.distanceTo(face.boundingSphere.center) + tile.boundingSphere.radius;
  					if (distance < face.boundingSphere.radius){
  						face.children.push(tile);
  						parentFound = true;
  						break;
  					}
  				}
  				if (!parentFound){
  					unparentedTiles.push(tile);
  				}
  			}
  	});

  	var rootPartition;
  	action.executeSubaction(function (action){
  			rootPartition = new SpatialPartition(new THREE.Sphere(new THREE.Vector3(0, 0, 0), maxDistanceFromOrigin), [], unparentedTiles);
  			for (var i = 0; i < icosahedron.faces.length; ++i){
  				var face = icosahedron.faces[i];
  				rootPartition.partitions.push(new SpatialPartition(face.boundingSphere, [], face.children));
  				delete face.boundingSphere;
  				delete face.children;
  			}
  	});

  	action.provideResult(function () {
  			return rootPartition;
  	});
  }
  // ===========================================================================




  // GENERATE PLANET TERRAIN ===================================================
  //##########################################################################
  /*
  *
  */
  generatePlanetTerrain(planet, plateCount, oceanicRate, heatLevel, moistureLevel, random, action){
  	action
  	.executeSubaction( (action) => {
              this.generatePlanetTectonicPlates(planet.topology, plateCount, oceanicRate, random, action);
      }, 3, "Generating Tectonic Plates")
      .getResult( (result) => {
              planet.plates = result;
      })
      .executeSubaction( (action) => {
              this.generatePlanetElevation(planet.topology, planet.plates, action);
      }, 4, "Generating Elevation")
      .executeSubaction( (action) => {
              this.generatePlanetWeather(planet.topology, planet.partition, heatLevel, moistureLevel, random, action);
      }, 16, "Generating Weather")
      .executeSubaction( (action) => {
              this.generatePlanetBiomes(planet.topology.tiles, 1000, action);
      }, 1, "Generating Biomes");

      /* TODO dane dla serwera */
      if (!true) {
      	setTimeout(function () {
      			//console.log("regiony", planet.topology.tiles);
      			var t = planet.topology.tiles;
      			var nt = [];
      			for (var i = 0; i < t.length; i++) {
      				// console.log(t[i]);
      				var n = {
      					'id': t[i].id,
      					'area': t[i].area,
      					'biome': t[i].biome,
      					'elevation': t[i].elevation,
      				};
      				//console.log(t[i]);
      				nt.push(n);
      			}
      			// console.log(JSON.stringify(nt));
      	}, 10000);
      }
  }

  //##########################################################################
  generatePlanetTectonicPlates(topology, plateCount, oceanicRate, random, action){
  	var plates = [];
  	var platelessTiles = [];
  	var platelessTilePlates = [];
  	action.executeSubaction( (action) => {
  			var failedCount = 0;
  			while (plates.length < plateCount && failedCount < 10000){
  				var corner = topology.corners[random.integerExclusive(0, topology.corners.length)];
  				var adjacentToExistingPlate = false;
  				for (var i = 0; i < corner.tiles.length; ++i){
  					if (corner.tiles[i].plate){
  						adjacentToExistingPlate = true;
  						failedCount += 1;
  						break;
  					}
  				}
  				if (adjacentToExistingPlate)
  					continue;

  				failedCount = 0;

  				var oceanic = (random.unit() < oceanicRate);
  				var plate = new Plate(
  					new THREE.Color(random.integer(0, 0xFFFFFF)),
  					randomUnitVector(random),
  					random.realInclusive(-Math.PI / 30, Math.PI / 30),
  					random.realInclusive(-Math.PI / 30, Math.PI / 30),
  					oceanic ? random.realInclusive(-0.8, -0.3) : random.realInclusive(0.1, 0.5),
  					oceanic,
  					corner);
  				plates.push(plate);

  				for (var i = 0; i < corner.tiles.length; ++i){
  					corner.tiles[i].plate = plate;
  					plate.tiles.push(corner.tiles[i]);
  				}

  				for (var i = 0; i < corner.tiles.length; ++i){
  					var tile = corner.tiles[i];
  					for (var j = 0; j < tile.tiles.length; ++j){
  						var adjacentTile = tile.tiles[j];
  						if (!adjacentTile.plate){
  							platelessTiles.push(adjacentTile);
  							platelessTilePlates.push(plate);
  						}
  					}
  				}
  			}
  	});

  	action.executeSubaction( (action) => {
  			while (platelessTiles.length > 0){
  				var tileIndex = Math.floor(Math.pow(random.unit(), 2) * platelessTiles.length);
  				var tile = platelessTiles[tileIndex];
  				var plate = platelessTilePlates[tileIndex];
  				platelessTiles.splice(tileIndex, 1);
  				platelessTilePlates.splice(tileIndex, 1);
  				if (!tile.plate){
  					tile.plate = plate;
  					plate.tiles.push(tile);
  					for (var j = 0; j < tile.tiles.length; ++j){
  						if (!tile.tiles[j].plate){
  							platelessTiles.push(tile.tiles[j]);
  							platelessTilePlates.push(plate);
  						}
  					}
  				}
  			}
  	});
  	action.executeSubaction(this.calculateCornerDistancesToPlateRoot.bind(null, plates));
  	action.provideResult(plates);
  }

  //##########################################################################
  calculateCornerDistancesToPlateRoot(plates, action){
  	var distanceCornerQueue = [];
  	for (var i = 0; i < plates.length; ++i){
  		var corner = plates[i].root;
  		corner.distanceToPlateRoot = 0;
  		for (var j = 0; j < corner.corners.length; ++j){
  			distanceCornerQueue.push({corner: corner.corners[j], distanceToPlateRoot: corner.borders[j].length()});
  		}
  	}

  	var distanceCornerQueueSorter = function (left, right) {
  		return left.distanceToPlateRoot - right.distanceToPlateRoot;
  	};

  	action.executeSubaction(function (action){
  			if (distanceCornerQueue.length === 0)
  				return;

  			var iEnd = iEnd = distanceCornerQueue.length;
  			for (var i = 0; i < iEnd; ++i){
  				var front = distanceCornerQueue[i];
  				var corner = front.corner;
  				var distanceToPlateRoot = front.distanceToPlateRoot;
  				if (!corner.distanceToPlateRoot || corner.distanceToPlateRoot > distanceToPlateRoot){
  					corner.distanceToPlateRoot = distanceToPlateRoot;
  					for (var j = 0; j < corner.corners.length; ++j){
  						distanceCornerQueue.push({corner: corner.corners[j], distanceToPlateRoot: distanceToPlateRoot + corner.borders[j].length()});
  					}
  				}
  			}
  			distanceCornerQueue.splice(0, iEnd);
  			distanceCornerQueue.sort(distanceCornerQueueSorter);

  			action.loop();
  	});
  }

  //##########################################################################
  /*
  *
  */
  generatePlanetElevation(topology, plates, action){
  	var boundaryCorners;
  	var boundaryCornerInnerBorderIndexes;
  	var elevationBorderQueue;
  	var elevationBorderQueueSorter = function (left, right) {
  		return left.distanceToPlateBoundary - right.distanceToPlateBoundary;
  	};

  	action
  	.executeSubaction( (action) => {
              this.identifyBoundaryBorders(topology.borders, action);
      }, 1)
      .executeSubaction( (action) => {
              this.collectBoundaryCorners(topology.corners, action);
      }, 1)
      .getResult( (result) => {
              boundaryCorners = result;
              //console.log(result);
      })
      .executeSubaction( (action) => {
              this.calculatePlateBoundaryStress(boundaryCorners, action);
      }, 2)
      .getResult( (result) => {
              boundaryCornerInnerBorderIndexes = result;
      })
      .executeSubaction( (action) => {
              this.blurPlateBoundaryStress(boundaryCorners, 3, 0.4, action);
      }, 2)
      .executeSubaction( (action) => {
              this.populateElevationBorderQueue(boundaryCorners, boundaryCornerInnerBorderIndexes, action);
      }, 2)
      .getResult( (result) => {
              elevationBorderQueue = result;
      })
      .executeSubaction( (action) => {
              this.processElevationBorderQueue(elevationBorderQueue, elevationBorderQueueSorter, action);
      }, 10)
      .executeSubaction( (action) => {
              this.calculateTileAverageElevations(topology.tiles, action);
      }, 2);
  }

  //##########################################################################
  identifyBoundaryBorders(borders, action){
  	for (var i = 0; i < borders.length; ++i){
  		var border = borders[i];
  		if (border.tiles[0].plate !== border.tiles[1].plate){
  			border.betweenPlates = true;
  			border.corners[0].betweenPlates = true;
  			border.corners[1].betweenPlates = true;
  			border.tiles[0].plate.boundaryBorders.push(border);
  			border.tiles[1].plate.boundaryBorders.push(border);
  		}
  	}
  }

  //##########################################################################
  collectBoundaryCorners(corners, action){
  	var boundaryCorners = [];
  	for (var j = 0; j < corners.length; ++j){
  		var corner = corners[j];
  		if (corner.betweenPlates){
  			boundaryCorners.push(corner);
  			corner.tiles[0].plate.boundaryCorners.push(corner);
  			if (corner.tiles[1].plate !== corner.tiles[0].plate)
  				corner.tiles[1].plate.boundaryCorners.push(corner);
  			if (corner.tiles[2].plate !== corner.tiles[0].plate && corner.tiles[2].plate !== corner.tiles[1].plate)
  				corner.tiles[2].plate.boundaryCorners.push(corner);
  		}
  	}
  	action.provideResult(boundaryCorners);
  }

  //##########################################################################
  calculatePlateBoundaryStress(boundaryCorners, action){
  	var boundaryCornerInnerBorderIndexes = new Array(boundaryCorners.length);
  	for (var i = 0; i < boundaryCorners.length; ++i){
  		var corner = boundaryCorners[i];
  		corner.distanceToPlateBoundary = 0;

  		var innerBorder;
  		var innerBorderIndex;
  		for (var j = 0; j < corner.borders.length; ++j){
  			var border = corner.borders[j];
  			if (!border.betweenPlates){
  				innerBorder = border;
  				innerBorderIndex = j;
  				break;
  			}
  		}

  		if (innerBorder){
  			boundaryCornerInnerBorderIndexes[i] = innerBorderIndex;
  			var outerBorder0 = corner.borders[(innerBorderIndex + 1) % corner.borders.length];
  			var outerBorder1 = corner.borders[(innerBorderIndex + 2) % corner.borders.length]
  			var farCorner0 = outerBorder0.oppositeCorner(corner);
  			var farCorner1 = outerBorder1.oppositeCorner(corner);
  			var plate0 = innerBorder.tiles[0].plate;
  			var plate1 = outerBorder0.tiles[0].plate !== plate0 ? outerBorder0.tiles[0].plate : outerBorder0.tiles[1].plate;
  			var boundaryVector = farCorner0.vectorTo(farCorner1);
  			var boundaryNormal = boundaryVector.clone().cross(corner.position);
  			var stress = this.calculateStress(plate0.calculateMovement(corner.position), plate1.calculateMovement(corner.position), boundaryVector, boundaryNormal);
  			corner.pressure = stress.pressure;
  			corner.shear = stress.shear;
  		} else{
  			boundaryCornerInnerBorderIndexes[i] = null;
  			var plate0 = corner.tiles[0].plate;
  			var plate1 = corner.tiles[1].plate;
  			var plate2 = corner.tiles[2].plate;
  			var boundaryVector0 = corner.corners[0].vectorTo(corner);
  			var boundaryVector1 = corner.corners[1].vectorTo(corner);
  			var boundaryVector2 = corner.corners[2].vectorTo(corner);
  			var boundaryNormal0 = boundaryVector0.clone().cross(corner.position);
  			var boundaryNormal1 = boundaryVector1.clone().cross(corner.position);
  			var boundaryNormal2 = boundaryVector2.clone().cross(corner.position);
  			var stress0 = this.calculateStress(plate0.calculateMovement(corner.position), plate1.calculateMovement(corner.position), boundaryVector0, boundaryNormal0);
  			var stress1 = this.calculateStress(plate1.calculateMovement(corner.position), plate2.calculateMovement(corner.position), boundaryVector1, boundaryNormal1);
  			var stress2 = this.calculateStress(plate2.calculateMovement(corner.position), plate0.calculateMovement(corner.position), boundaryVector2, boundaryNormal2);

  			corner.pressure = (stress0.pressure + stress1.pressure + stress2.pressure) / 3;
  			corner.shear = (stress0.shear + stress1.shear + stress2.shear) / 3;
  		}
  	}
  	action.provideResult(boundaryCornerInnerBorderIndexes);
  }

  //##########################################################################
  calculateStress(movement0, movement1, boundaryVector, boundaryNormal){
  	var relativeMovement = movement0.clone().sub(movement1);
  	var pressureVector = relativeMovement.clone().projectOnVector(boundaryNormal);
  	var pressure = pressureVector.length();
  	if (pressureVector.dot(boundaryNormal) > 0)
  		pressure = -pressure;
  	var shear = relativeMovement.clone().projectOnVector(boundaryVector).length();
  	return {pressure: 2 / (1 + Math.exp(-pressure / 30)) - 1, shear: 2 / (1 + Math.exp(-shear / 30)) - 1};
  }

  //##########################################################################
  blurPlateBoundaryStress(boundaryCorners, stressBlurIterations, stressBlurCenterWeighting, action){
  	var newCornerPressure = new Array(boundaryCorners.length);
  	var newCornerShear = new Array(boundaryCorners.length);
  	for (var i = 0; i < stressBlurIterations; ++i){
  		for (var j = 0; j < boundaryCorners.length; ++j){
  			var corner = boundaryCorners[j];
  			var averagePressure = 0;
  			var averageShear = 0;
  			var neighborCount = 0;
  			for (var k = 0; k < corner.corners.length; ++k){
  				var neighbor = corner.corners[k];
  				if (neighbor.betweenPlates){
  					averagePressure += neighbor.pressure;
  					averageShear += neighbor.shear;
  					++neighborCount;
  				}
  			}
  			newCornerPressure[j] = corner.pressure * stressBlurCenterWeighting + (averagePressure / neighborCount) * (1 - stressBlurCenterWeighting);
  			newCornerShear[j] = corner.shear * stressBlurCenterWeighting + (averageShear / neighborCount) * (1 - stressBlurCenterWeighting);
  		}

  		for (var j = 0; j < boundaryCorners.length; ++j){
  			var corner = boundaryCorners[j];
  			if (corner.betweenPlates){
  				corner.pressure = newCornerPressure[j];
  				corner.shear = newCornerShear[j];
  			}
  		}
  	}
  }

  //##########################################################################
  populateElevationBorderQueue(boundaryCorners, boundaryCornerInnerBorderIndexes, action){
  	var elevationBorderQueue = [];
  	for (var i = 0; i < boundaryCorners.length; ++i){
  		var corner = boundaryCorners[i];

  		var innerBorderIndex = boundaryCornerInnerBorderIndexes[i];
  		if (innerBorderIndex !== null){
  			var innerBorder = corner.borders[innerBorderIndex];
  			var outerBorder0 = corner.borders[(innerBorderIndex + 1) % corner.borders.length];
  			var plate0 = innerBorder.tiles[0].plate;
  			var plate1 = outerBorder0.tiles[0].plate !== plate0 ? outerBorder0.tiles[0].plate : outerBorder0.tiles[1].plate;

  			var calculateElevation;
  			if (corner.pressure > 0.3){
  				corner.elevation = Math.max(plate0.elevation, plate1.elevation) + corner.pressure;
  				if (plate0.oceanic === plate1.oceanic)
  					calculateElevation = this.calculateCollidingElevation;
  				else if (plate0.oceanic)
  					calculateElevation = this.calculateSubductingElevation;
  				else
  					calculateElevation = this.calculateSuperductingElevation;
  			} else if (corner.pressure < -0.3){
  				corner.elevation = Math.max(plate0.elevation, plate1.elevation) - corner.pressure / 4;
  				calculateElevation = this.calculateDivergingElevation;
  			} else if (corner.shear > 0.3){
  				corner.elevation = Math.max(plate0.elevation, plate1.elevation) + corner.shear / 8;
  				calculateElevation = this.calculateShearingElevation;
  			} else{
  				corner.elevation = (plate0.elevation + plate1.elevation) / 2;
  				calculateElevation = this.calculateDormantElevation;
  			}

  			var nextCorner = innerBorder.oppositeCorner(corner);
  			if (!nextCorner.betweenPlates){
  				elevationBorderQueue.push({
  						origin: {
  							corner: corner,
  							pressure: corner.pressure,
  							shear: corner.shear,
  							plate: plate0,
  							calculateElevation: calculateElevation
  						},
  						border: innerBorder,
  						corner: corner,
  						nextCorner: nextCorner,
  						distanceToPlateBoundary: innerBorder.length(),
  				});
  			}
  		} else{
  			var plate0 = corner.tiles[0].plate;
  			var plate1 = corner.tiles[1].plate;
  			var plate2 = corner.tiles[2].plate;

  			//elevation = 0;

  			if (corner.pressure > 0.3){
  				corner.elevation = Math.max(plate0.elevation, plate1.elevation, plate2.elevation) + corner.pressure;
  			} else if (corner.pressure < -0.3){
  				corner.elevation = Math.max(plate0.elevation, plate1.elevation, plate2.elevation) + corner.pressure / 4;
  			} else if (corner.shear > 0.3){
  				corner.elevation = Math.max(plate0.elevation, plate1.elevation, plate2.elevation) + corner.shear / 8;
  			} else{
  				corner.elevation = (plate0.elevation + plate1.elevation + plate2.elevation) / 3;
  			}
  		}
  	}
  	action.provideResult(elevationBorderQueue);
  }

  //##########################################################################
  calculateCollidingElevation(distanceToPlateBoundary, distanceToPlateRoot, boundaryElevation, plateElevation, pressure, shear){
  	var t = distanceToPlateBoundary / (distanceToPlateBoundary + distanceToPlateRoot);
  	if (t < 0.5){
  		t = t / 0.5;
  		return plateElevation + Math.pow(t - 1, 2) * (boundaryElevation - plateElevation);
  	} else{
  		return plateElevation;
  	}
  }

  //##########################################################################
  calculateSuperductingElevation(distanceToPlateBoundary, distanceToPlateRoot, boundaryElevation, plateElevation, pressure, shear){
  	var t = distanceToPlateBoundary / (distanceToPlateBoundary + distanceToPlateRoot);
  	if (t < 0.2){
  		t = t / 0.2;
  		return boundaryElevation + t * (plateElevation - boundaryElevation + pressure / 2);
  	} else if (t < 0.5){
  		t = (t - 0.2) / 0.3;
  		return plateElevation + Math.pow(t - 1, 2) * pressure / 2;
  	} else{
  		return plateElevation;
  	}
  }

  //##########################################################################
  calculateSubductingElevation(distanceToPlateBoundary, distanceToPlateRoot, boundaryElevation, plateElevation, pressure, shear){
  	var t = distanceToPlateBoundary / (distanceToPlateBoundary + distanceToPlateRoot);
  	return plateElevation + Math.pow(t - 1, 2) * (boundaryElevation - plateElevation);
  }

  //##########################################################################
  calculateDivergingElevation(distanceToPlateBoundary, distanceToPlateRoot, boundaryElevation, plateElevation, pressure, shear){
  	var t = distanceToPlateBoundary / (distanceToPlateBoundary + distanceToPlateRoot);
  	if (t < 0.3){
  		t = t / 0.3;
  		return plateElevation + Math.pow(t - 1, 2) * (boundaryElevation - plateElevation);
  	} else{
  		return plateElevation;
  	}
  }

  //##########################################################################
  calculateShearingElevation(distanceToPlateBoundary, distanceToPlateRoot, boundaryElevation, plateElevation, pressure, shear){
  	var t = distanceToPlateBoundary / (distanceToPlateBoundary + distanceToPlateRoot);
  	if (t < 0.2){
  		t = t / 0.2;
  		return plateElevation + Math.pow(t - 1, 2) * (boundaryElevation - plateElevation);
  	} else{
  		return plateElevation;
  	}
  }

  //##########################################################################
  calculateDormantElevation(distanceToPlateBoundary, distanceToPlateRoot, boundaryElevation, plateElevation, pressure, shear){
  	var t = distanceToPlateBoundary / (distanceToPlateBoundary + distanceToPlateRoot);
  	var elevationDifference = boundaryElevation - plateElevation;
  	var a = 2 * elevationDifference;
  	var b = -3 * elevationDifference;
  	return t * t * elevationDifference * (2 * t - 3) + boundaryElevation;
  }

  //##########################################################################
  processElevationBorderQueue(elevationBorderQueue, elevationBorderQueueSorter, action){
  	if (elevationBorderQueue.length === 0)
  		return;

  	var iEnd = iEnd = elevationBorderQueue.length;
  	for (var i = 0; i < iEnd; ++i){
  		var front = elevationBorderQueue[i];
  		var corner = front.nextCorner;
  		if (!corner.elevation){
  			corner.distanceToPlateBoundary = front.distanceToPlateBoundary;
  			corner.elevation = front.origin.calculateElevation(
                  corner.distanceToPlateBoundary,
                  corner.distanceToPlateRoot,
                  front.origin.corner.elevation,
                  front.origin.plate.elevation,
                  front.origin.pressure,
                  front.origin.shear);

              for (var j = 0; j < corner.borders.length; ++j){
              	var border = corner.borders[j];
              	if (!border.betweenPlates){
              		var nextCorner = corner.corners[j];
              		var distanceToPlateBoundary = corner.distanceToPlateBoundary + border.length();
              		if (!nextCorner.distanceToPlateBoundary || nextCorner.distanceToPlateBoundary > distanceToPlateBoundary){
              			elevationBorderQueue.push({
              					origin: front.origin,
              					border: border,
              					corner: corner,
              					nextCorner: nextCorner,
              					distanceToPlateBoundary: distanceToPlateBoundary,
              			});
              		}
              	}
              }
          }
      }
      elevationBorderQueue.splice(0, iEnd);
      elevationBorderQueue.sort(elevationBorderQueueSorter);

      action.loop();
  }

  //##########################################################################
  calculateTileAverageElevations(tiles, action){
  	for (var i = 0; i < tiles.length; ++i){
  		var tile = tiles[i];
  		var elevation = 0;
  		for (var j = 0; j < tile.corners.length; ++j){
  			elevation += tile.corners[j].elevation;
  		}
  		tile.elevation = elevation / tile.corners.length;
  		//console.log("calculateTileAverageElevations",tile.elevation);
  	}
  }

  //##########################################################################
  /*
  *
  */
  generatePlanetWeather(topology, partitions, heatLevel, moistureLevel, random, action){
  	var planetRadius = 1000;
  	var whorls;
  	var activeCorners;
  	var totalHeat;
  	var remainingHeat;
  	var totalMoisture;
  	var remainingMoisture;

  	action
  	.executeSubaction( (action) => {
              this.generateAirCurrentWhorls(planetRadius, random, action);
      }, 1, "Generating Air Currents")
      .getResult( (result) => {
              whorls = result;
      })
      .executeSubaction( (action) => {
              this.calculateAirCurrents(topology.corners, whorls, planetRadius, action);
      }, 1, "Generating Air Currents")
      .executeSubaction( (action) => {
              this.initializeAirHeat(topology.corners, heatLevel, action);
      }, 2, "Calculating Temperature")
      .getResult( (result) => {
              activeCorners = result.corners;
              totalHeat = result.airHeat;
              remainingHeat = result.airHeat;
      })
      .executeSubaction( (action) => {
              var consumedHeat = this.processAirHeat(activeCorners, action);
              remainingHeat -= consumedHeat;
              if (remainingHeat > 0 && consumedHeat >= 0.0001)
                  action.loop(1 - remainingHeat / totalHeat);
      }, 8, "Calculating Temperature")
      .executeSubaction( (action) => {
              this.calculateTemperature(topology.corners, topology.tiles, planetRadius, action);
      }, 1, "Calculating Temperature")
      .executeSubaction( (action) => {
              this.initializeAirMoisture(topology.corners, moistureLevel, action);
      }, 2, "Calculating Moisture")
      .getResult( (result) => {
              activeCorners = result.corners;
              totalMoisture = result.airMoisture;
              remainingMoisture = result.airMoisture;
      })
      .executeSubaction( (action) => {
              var consumedMoisture = this.processAirMoisture(activeCorners, action);
              remainingMoisture -= consumedMoisture;
              if (remainingMoisture > 0 && consumedMoisture >= 0.0001)
                  action.loop(1 - remainingMoisture / totalMoisture);
      }, 32, "Calculating Moisture")
      .executeSubaction( (action) => {
              this.calculateMoisture(topology.corners, topology.tiles, action);
      }, 1, "Calculating Moisture");
  }

  //##########################################################################
  generateAirCurrentWhorls(planetRadius, random, action){
  	var whorls = [];
  	var direction = random.integer(0, 1) ? 1 : -1;
  	var layerCount = random.integer(4, 7);
  	var circumference = Math.PI * 2 * planetRadius;
  	var fullRevolution = Math.PI * 2;
  	var baseWhorlRadius = circumference / (2 * (layerCount - 1));

  	whorls.push({
  			center: new THREE.Vector3(0, planetRadius, 0)
              .applyAxisAngle(new THREE.Vector3(1, 0, 0), random.realInclusive(0, fullRevolution / (2 * (layerCount + 4))))
              .applyAxisAngle(new THREE.Vector3(0, 1, 0), random.real(0, fullRevolution)),
              strength: random.realInclusive(fullRevolution / 36, fullRevolution / 24) * direction,
      radius: random.realInclusive(baseWhorlRadius * 0.8, baseWhorlRadius * 1.2)});

      for (var i = 1; i < layerCount - 1; ++i){
      	direction = -direction;
      	var baseTilt = i / (layerCount - 1) * fullRevolution / 2;
      	var layerWhorlCount = Math.ceil((Math.sin(baseTilt) * planetRadius * fullRevolution) / baseWhorlRadius);
      	for (var j = 0; j < layerWhorlCount; ++j){
      		whorls.push({
      				center: new THREE.Vector3(0, planetRadius, 0)
                      .applyAxisAngle(new THREE.Vector3(1, 0, 0), random.realInclusive(0, fullRevolution / (2 * (layerCount + 4))))
                      .applyAxisAngle(new THREE.Vector3(0, 1, 0), random.real(0, fullRevolution))
                      .applyAxisAngle(new THREE.Vector3(1, 0, 0), baseTilt)
                      .applyAxisAngle(new THREE.Vector3(0, 1, 0), fullRevolution * (j + (i % 2) / 2) / layerWhorlCount),
                      strength: random.realInclusive(fullRevolution / 48, fullRevolution / 32) * direction,
              radius: random.realInclusive(baseWhorlRadius * 0.8, baseWhorlRadius * 1.2)});
          }
      }

      direction = -direction;
      whorls.push({
      		center: new THREE.Vector3(0, planetRadius, 0)
              .applyAxisAngle(new THREE.Vector3(1, 0, 0), random.realInclusive(0, fullRevolution / (2 * (layerCount + 4))))
              .applyAxisAngle(new THREE.Vector3(0, 1, 0), random.real(0, fullRevolution))
              .applyAxisAngle(new THREE.Vector3(1, 0, 0), fullRevolution / 2),
              strength: random.realInclusive(fullRevolution / 36, fullRevolution / 24) * direction,
      radius: random.realInclusive(baseWhorlRadius * 0.8, baseWhorlRadius * 1.2)});

      action.provideResult(whorls);
  }

  //##########################################################################
  calculateAirCurrents(corners, whorls, planetRadius, action){
  	var i = 0;
  	action.executeSubaction(function (action){
  			if (i >= corners.length)
  				return;

  			var corner = corners[i];
  			var airCurrent = new THREE.Vector3(0, 0, 0);
  			var weight = 0;
  			for (var j = 0; j < whorls.length; ++j){
  				var whorl = whorls[j];
  				var angle = whorl.center.angleTo(corner.position);
  				var distance = angle * planetRadius;
  				if (distance < whorl.radius){
  					var normalizedDistance = distance / whorl.radius;
  					var whorlWeight = 1 - normalizedDistance;
  					var whorlStrength = planetRadius * whorl.strength * whorlWeight * normalizedDistance;
  					var whorlCurrent = whorl.center.clone().cross(corner.position).setLength(whorlStrength);
  					airCurrent.add(whorlCurrent);
  					weight += whorlWeight;
  				}
  			}
  			airCurrent.divideScalar(weight);
  			corner.airCurrent = airCurrent;
  			corner.airCurrentSpeed = airCurrent.length(); //kilometers per hour

  			corner.airCurrentOutflows = new Array(corner.borders.length);
  			var airCurrentDirection = airCurrent.clone().normalize();
  			var outflowSum = 0;
  			for (var j = 0; j < corner.corners.length; ++j){
  				var vector = corner.vectorTo(corner.corners[j]).normalize();
  				var dot = vector.dot(airCurrentDirection);
  				if (dot > 0){
  					corner.airCurrentOutflows[j] = dot;
  					outflowSum += dot;
  				} else{
  					corner.airCurrentOutflows[j] = 0;
  				}
  			}

  			if (outflowSum > 0){
  				for (var j = 0; j < corner.borders.length; ++j){
  					corner.airCurrentOutflows[j] /= outflowSum;
  				}
  			}
  			++i;
  			action.loop(i / corners.length);
  	});
  }

  //##########################################################################
  initializeAirHeat(corners, heatLevel, action){
  	var activeCorners = [];
  	var airHeat = 0;
  	for (var i = 0; i < corners.length; ++i){
  		var corner = corners[i];
  		corner.airHeat = corner.area * heatLevel;
  		corner.newAirHeat = 0;
  		corner.heat = 0;

  		corner.heatAbsorption = 0.1 * corner.area / Math.max(0.1, Math.min(corner.airCurrentSpeed, 1));
  		if (corner.elevation <= 0){
  			corner.maxHeat = corner.area;
  		} else{
  			corner.maxHeat = corner.area;
  			corner.heatAbsorption *= 2;
  		}

  		activeCorners.push(corner);
  		airHeat += corner.airHeat;
  	}
  	action.provideResult({corners: activeCorners, airHeat: airHeat});
  }

  //##########################################################################
  processAirHeat(activeCorners, action){
  	var consumedHeat = 0;
  	var activeCornerCount = activeCorners.length;
  	for (var i = 0; i < activeCornerCount; ++i){
  		var corner = activeCorners[i];
  		if (corner.airHeat === 0)
  			continue;

  		var heatChange = Math.max(0, Math.min(corner.airHeat, corner.heatAbsorption * (1 - corner.heat / corner.maxHeat)));
  		corner.heat += heatChange;
  		consumedHeat += heatChange;
  		var heatLoss = corner.area * (corner.heat / corner.maxHeat) * 0.02;
  		heatChange = Math.min(corner.airHeat, heatChange + heatLoss);

  		var remainingCornerAirHeat = corner.airHeat - heatChange;
  		corner.airHeat = 0;

  		for (var j = 0; j < corner.corners.length; ++j){
  			var outflow = corner.airCurrentOutflows[j];
  			if (outflow > 0){
  				corner.corners[j].newAirHeat += remainingCornerAirHeat * outflow;
  				activeCorners.push(corner.corners[j]);
  			}
  		}
  	}

  	activeCorners.splice(0, activeCornerCount);
  	for (var i = 0; i < activeCorners.length; ++i){
  		var corner = activeCorners[i];
  		corner.airHeat = corner.newAirHeat;
  	}
  	for (var i = 0; i < activeCorners.length; ++i){
  		activeCorners[i].newAirHeat = 0;
  	}
  	return consumedHeat;
  }

  //##########################################################################
  calculateTemperature(corners, tiles, planetRadius, action){
  	for (var i = 0; i < corners.length; ++i){
  		var corner = corners[i];
  		var latitudeEffect = Math.sqrt(1 - Math.abs(corner.position.y) / planetRadius);
  		var elevationEffect = 1 - Math.pow(Math.max(0, Math.min(corner.elevation * 0.8, 1)), 2);
  		var normalizedHeat = corner.heat / corner.area;
  		corner.temperature = (latitudeEffect * elevationEffect * 0.7 + normalizedHeat * 0.3) * 5 / 3 - 2 / 3;
  		delete corner.airHeat;
  		delete corner.newAirHeat;
  		delete corner.heat;
  		delete corner.maxHeat;
  		delete corner.heatAbsorption;
  	}

  	for (var i = 0; i < tiles.length; ++i){
  		var tile = tiles[i];
  		tile.temperature = 0;
  		for (var j = 0; j < tile.corners.length; ++j){
  			tile.temperature += tile.corners[j].temperature;
  		}
  		tile.temperature /= tile.corners.length;
  	}
  }

  //##########################################################################
  initializeAirMoisture(corners, moistureLevel, action){
  	var activeCorners = [];
  	var airMoisture = 0;
  	for (var i = 0; i < corners.length; ++i){
  		var corner = corners[i];
  		corner.airMoisture = (corner.elevation > 0) ? 0 : corner.area * moistureLevel * Math.max(0, Math.min(0.5 + corner.temperature * 0.5, 1));
  		corner.newAirMoisture = 0;
  		corner.precipitation = 0;

  		corner.precipitationRate = 0.0075 * corner.area / Math.max(0.1, Math.min(corner.airCurrentSpeed, 1));
  		corner.precipitationRate *= 1 + (1 - Math.max(0, Math.max(corner.temperature, 1))) * 0.1;
  		if (corner.elevation > 0){
  			corner.precipitationRate *= 1 + corner.elevation * 0.5;
  			corner.maxPrecipitation = corner.area * (0.25 + Math.max(0, Math.min(corner.elevation, 1)) * 0.25);
  		} else{
  			corner.maxPrecipitation = corner.area * 0.25;
  		}

  		activeCorners.push(corner);
  		airMoisture += corner.airMoisture;
  	}
  	action.provideResult({corners: activeCorners, airMoisture: airMoisture});
  }

  //##########################################################################
  processAirMoisture(activeCorners, action){
  	var consumedMoisture = 0;
  	var activeCornerCount = activeCorners.length;
  	for (var i = 0; i < activeCornerCount; ++i){
  		var corner = activeCorners[i];
  		if (corner.airMoisture === 0)
  			continue;

  		var moistureChange = Math.max(0, Math.min(corner.airMoisture, corner.precipitationRate * (1 - corner.precipitation / corner.maxPrecipitation)));
  		corner.precipitation += moistureChange;
  		consumedMoisture += moistureChange;
  		var moistureLoss = corner.area * (corner.precipitation / corner.maxPrecipitation) * 0.02;
  		moistureChange = Math.min(corner.airMoisture, moistureChange + moistureLoss);

  		var remainingCornerAirMoisture = corner.airMoisture - moistureChange;
  		corner.airMoisture = 0;

  		for (var j = 0; j < corner.corners.length; ++j){
  			var outflow = corner.airCurrentOutflows[j];
  			if (outflow > 0){
  				corner.corners[j].newAirMoisture += remainingCornerAirMoisture * outflow;
  				activeCorners.push(corner.corners[j]);
  			}
  		}
  	}

  	activeCorners.splice(0, activeCornerCount);
  	for (var i = 0; i < activeCorners.length; ++i){
  		var corner = activeCorners[i];
  		corner.airMoisture = corner.newAirMoisture;
  	}
  	for (var i = 0; i < activeCorners.length; ++i){
  		activeCorners[i].newAirMoisture = 0;
  	}
  	return consumedMoisture;
  }

  //##########################################################################
  calculateMoisture(corners, tiles, action){
  	for (var i = 0; i < corners.length; ++i){
  		var corner = corners[i];
  		corner.moisture = corner.precipitation / corner.area / 0.5;
  		delete corner.airMoisture;
  		delete corner.newAirMoisture;
  		delete corner.precipitation;
  		delete corner.maxPrecipitation;
  		delete corner.precipitationRate;
  	}

  	for (var i = 0; i < tiles.length; ++i){
  		var tile = tiles[i];
  		tile.moisture = 0;
  		for (var j = 0; j < tile.corners.length; ++j){
  			tile.moisture += tile.corners[j].moisture;
  		}
  		tile.moisture /= tile.corners.length;
  	}
  }

  //##########################################################################
  /*
  *
  */
  generatePlanetBiomes(tiles, planetRadius, action){
  	for (var i = 0; i < tiles.length; ++i){
  		var tile = tiles[i];
  		var elevation = Math.max(0, tile.elevation);
  		var latitude = Math.abs(tile.position.y / planetRadius);
  		var temperature = tile.temperature;
  		var moisture = tile.moisture;

  		if (elevation <= 0){
  			if (temperature > 0){
  				tile.biome = "ocean";
  			} else{
  				tile.biome = "oceanGlacier";
  			}
  		} else if (elevation < 0.6){
  			if (temperature > 0.75){
  				if (moisture < 0.25){
  					tile.biome = "desert";
  				} else{
  					tile.biome = "rainForest";
  				}
  			} else if (temperature > 0.5){
  				if (moisture < 0.25){
  					tile.biome = "rocky";
  				} else if (moisture < 0.50){
  					tile.biome = "plains";
  				} else{
  					tile.biome = "swamp";
  				}
  			} else if (temperature > 0){
  				if (moisture < 0.25){
  					tile.biome = "plains";
  				} else if (moisture < 0.50){
  					tile.biome = "grassland";
  				} else{
  					tile.biome = "deciduousForest";
  				}
  			} else{
  				if (moisture < 0.25){
  					tile.biome = "tundra";
  				} else{
  					tile.biome = "landGlacier";
  				}
  			}
  		} else if (elevation < 0.8){
  			if (temperature > 0){
  				if (moisture < 0.25){
  					tile.biome = "tundra";
  				} else{
  					tile.biome = "coniferForest";
  				}
  			} else{
  				tile.biome = "tundra";
  			}
  		} else{
  			if (temperature > 0 || moisture < 0.25){
  				tile.biome = "mountain";
  			} else{
  				tile.biome = "snowyMountain";
  			}
  		}
  	}
  }
  // END GENERATE TERRAIN ====================================================
}

export default Planet3DGenerator
