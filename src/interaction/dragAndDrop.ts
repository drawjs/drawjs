import  'lib/event.js'
import { DRAW_INSTANCE_NAME } from 'store/constant'
import * as interfaces from 'interface/index'

let drawInstance: any
let draggingElement: any
let deltaPointtoLeftSideX: number
let deltaPointtoLeftSideY: number

export default function( draw ) {
	drawInstance = draw

	eventjs.add( drawInstance.canvas, 'drag', onDrag);
}

function onDrag( event: any, eventInfo:any = {} ) {
	if ( eventInfo.state === 'down' ) {
		const possibleTopElement = getTopElementWhenClick( event, eventInfo )

		if ( possibleTopElement ) {
			setDraggingElement( possibleTopElement )
			setDeltaPointtoLeftSideX( eventInfo.x - draggingElement.left )
			setDeltaPointtoLeftSideY( eventInfo.y - draggingElement.top )
			startDrag( draggingElement, event, eventInfo )
		}
	}

	if ( draggingElement && draggingElement.draggable === true ) {
		// Once dragging anywhere after start dragging top element, activate method: dragging
		eventInfo.state === 'move' && dragging( draggingElement, event, eventInfo )

		// Once stopping drag anywhere, activate method: stopDrag
		eventInfo.state === 'up' && stopDrag( draggingElement, event, eventInfo )

		drawInstance.render()
	}
}


function getTopElementWhenClick( event: any, eventInfo:any = {} ) {
	const elementsContainPoint = getElementsContainPoint( event, eventInfo )

	if ( elementsContainPoint.length > 0 ) {
		return elementsContainPoint[ elementsContainPoint.length - 1 ]
	}

	return null
}

function getElementsContainPoint( event: any, eventInfo:any = {} ) {
	const x = eventInfo.x
	const y = eventInfo.y
	const isContainPoint = element => element.containPoint( x, y )
	return drawInstance.__storeActiveElementsInstances__.filter( isContainPoint )
}


function startDrag( element: any, event: any, eventInfo:any = {} ) {
	element.onDragStart && element.onDragStart( element, eventInfo )
}

function dragging( element: any, event: any, eventInfo:any = {} ) {
	try {
		deltaPointtoLeftSideX && element.set( 'left', eventInfo.x - deltaPointtoLeftSideX )
		deltaPointtoLeftSideY && element.set( 'top', eventInfo.y - deltaPointtoLeftSideY )
	} catch ( e ) { 0 }

	element && element.onDragging && element.onDragging( element, eventInfo )
}

function stopDrag( element: any, event: any, eventInfo:any = {} ) {
	element && element.onDragStop && element.onDragStop( element, eventInfo )
	resetDraggingElement()
	resetDeltaPointtoLeftSideX()
	resetDeltaPointtoLeftSideY()
}

function setDraggingElement( element ) {
	draggingElement = element
}

function resetDraggingElement() {
	draggingElement = null
}

function setDeltaPointtoLeftSideX( x ) {
	deltaPointtoLeftSideX = x
}

function resetDeltaPointtoLeftSideX() {
	deltaPointtoLeftSideX = null
}

function setDeltaPointtoLeftSideY( y ) {
	deltaPointtoLeftSideY = y
}

function resetDeltaPointtoLeftSideY() {
	deltaPointtoLeftSideY = null
}


