export function equalPoint( A: Point2D, B: Point2D ) {
	return A.x === B.x && A.y === B.y
}

export function allElementsEqual( array: any[] ) {
	return array.every( ( element, index, array ) => element === array[ 0 ] )
}


export function equal( a: any, b: any ) {
	return a === b
}

export function notEqual( a: any, b: any ) {
	return ! equal( a, b )
}
