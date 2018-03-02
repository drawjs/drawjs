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

draw.addElement( "polygon", {
	left  : 350,
	top   : 250,
	fill  : "blue",
	width : 100,
	height: 100,
	angle : 10,
	points: polygon(),
	rotatable: true
} )

draw.render()

function triangle() {
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
			x: 100,
			y: 200
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
			x: basicOrigin.x + 100,
			y: basicOrigin.y + 10
		},
		{
			x: basicOrigin.x + 150,
			y: basicOrigin.y + 10
		},
		{
			x: basicOrigin.x + 200,
			y: basicOrigin.y + 100
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
