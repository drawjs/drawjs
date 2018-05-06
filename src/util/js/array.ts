import { notNil } from "../lodash/index"

export function isFirst( index: number ) {
	return index === 0
}

export const notFirst = ( index: number ) => !isFirst( index )

export function isLast( index: number, array: any[] ) {
	return index === array.length - 1
}

export const notLast = ( index: number, array: any[] ) => !isLast( index, array )

export function isFirstElement( element: any, index: number ) {
	return isFirst( index )
}

export const notFirstElement = ( element: any, index: number ) =>
	!isFirstElement( element, index )

export function isLastElement( element: any, index: number, array: any[] ) {
	return isLast( index, array )
}

export const notLastElement = ( element: any, index: number, array: any[] ) =>
	!isLastElement( element, index, array )

export function findArrayFirstIndex( array: any[], element: any ) {
	for ( let i = 0; i < array.length; i++ ) {
		const potential = array[ i ]
		if ( potential === element ) {
			return i
		}
	}

	return null
}

export function firstElement( array: any[] ) {
	return array[ 0 ]
}

export function lastElement( array: any[] ) {
	const { length } = array
	return array[ length - 1 ]
}

/**
 * // Delete
 */
export function removeElement( array: any[], element: any ) {
	const index: number = findArrayFirstIndex( array, element )

	if ( notNil( index ) ) {
		array.splice( index, 1 )
	}
}
