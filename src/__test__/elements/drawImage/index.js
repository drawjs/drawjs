const draw = new Draw( document.getElementById( "canvas" ) )

const instance = draw.addElement( "image", {
	x: 300,
	y: 300,
	width: 100,
	height: 100,
	src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Winding_Number_Around_Point.svg/380px-Winding_Number_Around_Point.svg.png",
	strokeColor: 'grey'
} )


draw.render()


setTimeout(() => {
	instance.sizeOnCenter( 2, 2, instance.itemCenter )
	draw.render()
},1000)
