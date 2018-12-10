export function isLeftMouseClick( event ) {
	return event && ( event.which == 1 || event.button == 1 )
}

export function isRightMouseClick( event ) {
	return event && ( event.which == 3 || event.button == 2 )
}

export function isMiddleClick( event ) {
	return event && ( event.which == 2 || event.button == 4 )
}

