const draw = new Draw( document.getElementById( "canvas" ) )

const basicOrigin = {
	x: 100,
	y: 100
}

// draw.addElement( "polygon", {
// 	left  : 350,
// 	top   : 250,
// 	fill  : "red",
// 	width : 100,
// 	height: 100,
// 	angle : 0,
// 	points: polygon()
// } )

const instance1 = draw.addElement( "polygon", {
	fill     : "blue",
	// angle    : 0,
	points   : polygon(),
	rotatable: true,
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
