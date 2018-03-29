// import config from '../scmap/config';
const config = {};

import * as THREE from 'three';

function hasLocalStorage() {
	try {
		return 'localStorage' in window && window.localStorage !== null;
	} catch(e) {
		return false;
	}
}

function hasSessionStorage() {
	try {
		return 'sessionStorage' in window && window.sessionStorage !== null;
	} catch(e) {
		return false;
	}
}

function humanSort( a, b ) {
	let aa = a.name.split(/(\d+)/);
	let bb = b.name.split(/(\d+)/);

	for ( let x = 0; x < Math.max( aa.length, bb.length ); x++ )
	{
		if ( aa[x] != bb[x] )
		{
			let cmp1 = ( isNaN( parseInt( aa[x], 10 ) ) ) ? aa[x] : parseInt( aa[x], 10 );
			let cmp2 = ( isNaN( parseInt( bb[x], 10 ) ) ) ? bb[x] : parseInt( bb[x], 10 );

			if ( cmp1 === undefined || cmp2 === undefined ) {
				return aa.length - bb.length;
			} else {
				return ( cmp1 < cmp2 ) ? -1 : 1;
			}
		}
	}

	return 0;
}

function travelTimeForAU( distanceAU ) {
	return ( config.approximateTraveltimePerAU * distanceAU );
}

function hashString(s){
    var hash = 0;
    var length = s.length;
    if (length === 0)
        return hash;
    for (var i = 0; i < length; ++i)
    {
        var character = s.charCodeAt(1);
        hash = ((hash << 5) - hash) + character;
        hash |= 0;
    }
    return hash;
}

function adjustRange(value, oldMin, oldMax, newMin, newMax){
    return (value - oldMin) / (oldMax - oldMin) * (newMax - newMin) + newMin;
}

function accumulateArray(array, state, accumulator){
    for (var i = 0; i < array.length; ++i){
        state = accumulator(state, array[i]);
    }
    return state;
}

function slerp(p0, p1, t){
    var omega = Math.acos(p0.dot(p1));
    return p0.clone().multiplyScalar(Math.sin((1 - t) * omega)).add(p1.clone().multiplyScalar(Math.sin(t * omega))).divideScalar(Math.sin(omega));
}

function calculateTriangleArea(pa, pb, pc){
    var vab = new THREE.Vector3().subVectors(pb, pa);
    var vac = new THREE.Vector3().subVectors(pc, pa);
    var faceNormal = new THREE.Vector3().crossVectors(vab, vac);
    var vabNormal = new THREE.Vector3().crossVectors(faceNormal, vab).normalize();
    var plane = new THREE.Plane().setFromNormalAndCoplanarPoint(vabNormal, pa);
    var height = plane.distanceToPoint(pc);
    var width = vab.length();
    var area = width * height * 0.5;
    return area;
}

function randomUnitVector(random){
    var theta = random.real(0, Math.PI * 2);
    var phi = Math.acos(random.realInclusive(-1, 1));
    var sinPhi = Math.sin(phi);
    return new THREE.Vector3(
    	Math.cos(theta) * sinPhi,
    	Math.sin(theta) * sinPhi,
    	Math.cos(phi));
}

function intersectRayWithSphere(ray, sphere){
    var v1 = sphere.center.clone().sub(ray.origin);
    var v2 = v1.clone().projectOnVector(ray.direction);
    var d = v1.distanceTo(v2);
    return (d <= sphere.radius);
}

export { hasLocalStorage, hasSessionStorage, humanSort, travelTimeForAU, hashString, adjustRange, accumulateArray, slerp, calculateTriangleArea, randomUnitVector, intersectRayWithSphere };
