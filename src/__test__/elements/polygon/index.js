const draw = new Draw( document.getElementById( "canvas" ), {
	showSegments: true,
	
	// curveUsesCanvasApi: false,
	// curveRate         : 0.5,

  showMiniMap  : true,
	miniMapWidth : 100,
	miniMapHeight: 80,
} )

const basicOrigin = {
	x: 100,
	y: 100
}

const instance1 = draw.addElement( "polygon", {
fill     : "blue",
	// angle    : 0,
	points   : triangle(),
	// showSegments: true,
	// rotatable: true,
	// sizable  : true,
	// showHandle: true,
	// draggable : false,
	// curveUsesCanvasApi: true,
	curveRate: 0.2,
// kX: 1,
// kY: 1
} )


// const instance2 = draw.addElement( "polygon", {
// 	fill     : "blue",
// 	// angle    : 0,
// 	points   : triangle(),
// 	rotatable: true,
// 	// kX: 1,
// 	// kY: 1
// } )

// const instance3 = draw.addElement( "polygon", {
// 	fill     : "blue",
// 	// angle    : 0,
// 	points   : rect(),
// 	rotatable: true,
// 	// kX: 1,
// 	// kY: 1
// } )

// instance.rotate( 30 )
// instance.size( -1, 1, instance.sizePoints.rightBottomPoint )

draw.render()

// draw.getters.viewPort.zoomBy( { x: 100, y: 100 }, 1 )

// function render() {
// 	polygonInstance.rotate( polygonInstance.angle + 0.1 )
// 	draw.render()

// 	window.requestAnimationFrame( render )
// }

// window.requestAnimationFrame( render )

function triangle() {
	return [
		{
			x: 600,
			y: 150
		},
		{
			x: 650,
			y: 250
		},
		{
			x: 550,
			y: 250
		}
	]
}

function rect() {
	return [
		{
			x: 100,
			y: 100
		},
		{
			x: 200,
			y: 100
		},
		{
			x: 200,
			y: 200
		},
		{
			x: 100,
			y: 200
		}
	]
}

function polygon() {
	return [
		{
			x: 300,
			y: 100
		},
		{
			x: 100,
			y: 300
		},
		{
			x: 150,
			y: 300
		},
		{
			x: basicOrigin.x + 150,
			y: basicOrigin.y + 200
		},
		{
			x: basicOrigin.x + 100,
			y: basicOrigin.y + 200
		},
		{
			x: basicOrigin.x + 50,
			y: basicOrigin.y + 100
		}
	]
}





/**
 * Test performance
 */
// performanceTest()


// function performanceTest() {
// 	let res = null
// 	const speed = 1
// 	const maxStep = 100
// 	let mockEvent = {
// 		x: 0,
// 		y: 0
// 	}
// 	const start = performance.now()
// 	let end = null

// 	instance1.dragger.enable = true;
// 	instance1.dragger.start( mockEvent )

// 	for ( let i = 0; i <= maxStep; i++ ) {
// 		if ( i < maxStep ) {
// 			mockEvent = {
// 				x: i * speed,
// 				y: i * speed
// 			}

// 			instance1.dragger.dragging( mockEvent )
// 		}

// 		if ( i === maxStep ) {
// 			instance1.dragger.stop( mockEvent )
// 			end = performance.now()
// 			res = end - start
// 		}
// 	}

// 	return res
// }

// function averagePerformanceTest( performanceTestFn, count = 1 ) {
// 	let sum = 0
// 	for ( let i = 0; i < count; i++ ) {
// 		sum = sum + performanceTestFn()
// 	}
// 	return sum / count
// }

// console.log( draw.sharedActions.averageMockDragCellPerformanceTest( instance1, 1, 1000 ) )
// console.log( draw.sharedActions.averageMockDragCellPerformanceTest( instance1, 100, 1 ) )
// console.log( performanceTest() )
