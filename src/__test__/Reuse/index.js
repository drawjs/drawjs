const draw1 = new Draw( document.getElementById( "canvas1" ) )
const draw2 = new Draw( document.getElementById( "canvas2" ) )


draw1.addElement( "polygon", {
	left  : 350,
	top   : 250,
	fill  : "blue",
	width : 100,
	height: 100,
	angle : 10,
	points: polygon(),
	rotatable: true
} )

draw2.addElement( "polygon", {
	left  : 350,
	top   : 250,
	fill  : "blue",
	width : 100,
	height: 100,
	angle : 10,
	points: polygon(),
	rotatable: true
} )

draw1.render()

draw2.render()

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
	const basic = {
		x: 100,
		y: 100
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
