export function isMiddleClick( event ) {
	return event && ( event.which == 2 || event.button == 4 )
}
