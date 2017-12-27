let isDragging: boolean= false
let drawInstance

export default function( draw ) {
	drawInstance = draw

	draw.canvas.addEventListener( 'mousedown', beginDrag, false )
	draw.canvas.addEventListener( 'mousemove', tryDrag, false )
	draw.canvas.addEventListener( 'mouseup', endDrag, false )
	draw.canvas.addEventListener( 'mouseout', endDrag, false )
}

function beginDrag( e ) {
	isDragging = true
	console.log( 'startDrag' )
}

function tryDrag() {
	if ( drawInstance.draggable && isDragging ) {
		console.log( 'dragging' )
	}
}

function endDrag() {
	isDragging = false
	console.log( 'endDrag' )
}
