import  'lib/event.js'
import { DRAW_INSTANCE_NAME } from 'store/constant'

let drawInstance


export default function( draw ) {
	drawInstance = draw

	eventjs.add( drawInstance.canvas, 'drag', onDrag);
}

function onDrag( event, self ) {
	const topElement = getTopElementWhenClick( event )

	if ( topElement ) {
		dragElement( topElement, event )
	}
}


function getTopElementWhenClick( event ) {
	const elementsContainPoint = getElementsContainPoint( event )

	if ( elementsContainPoint.length > 0 ) {
		return elementsContainPoint[ elementsContainPoint.length - 1 ]
	}

	return null
}

function getElementsContainPoint( event ) {
	const x = event.offsetX
	const y = event.offsetY
	const isContainPoint = element => element.containPoint( x, y )
	return drawInstance.store.filter( isContainPoint )
}

function dragElement( element, event ) {
	element.set( 'x', event.x )
	element.set( 'y', event.y )
	element[ DRAW_INSTANCE_NAME ].render()
}
