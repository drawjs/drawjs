const draw = new Draw( document.getElementById( "canvas" ) )

draw.addElement( "point", {
	x: 300,
	y: 300,
	fill: 'blue'
} )

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

// draw.getters.viewPort.zoomBy( {
// 	x: 400,
// 	y: 300
// }, 1 )

draw.render()


function polygon() {
	const basic = {
		x: 350,
		y: 350
	}
	return [
		{
			x: basic.x + 100,
			y: basic.y + 10
		},
		{
			x: basic.x + 150,
			y: basic.y + 10
		},
		{
			x: basic.x + 200,
			y: basic.y + 100
		},
		{
			x: basic.x + 150,
			y: basic.y + 200
		},
		{
			x: basic.x + 100,
			y: basic.y + 200
		},
		{
			x: basic.x + 50,
			y: basic.y + 100
		}
	]
}
