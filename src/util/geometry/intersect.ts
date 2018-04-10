
interface Result {
	// Not at the same line
	isParallel: boolean,
	isSameLine: boolean
	intersected: Point2D,
}

/**
 * Algorithm:
 * y = kx + b
 */
export default function( lineA: LineTwoPoints, lineB: LineTwoPoints ): Result {
	let res: Result = {
		isParallel: false,
		isSameLine: false,
		intersected: null
	}

	const PA1: Point2D = lineA[ 0 ]
	const PA2: Point2D = lineA[ 1 ]

	const { x: x1, y: y1 } = PA1
	const { x: x2, y: y2 } = PA2

	const PB1: Point2D = lineB[ 0 ]
	const PB2: Point2D = lineB[ 1 ]

	const { x: x3, y: y3 } = PB1
	const { x: x4, y: y4 } = PB2

	if ( !isLineAVertical() && !isLineBVertical() ) {
		const kA = getK( PA1, PA2 )

		const kB = getK( PB1, PB2 )

		const bA = getB( PA1, PA2 )
		const bB = getB( PB1, PB2 )

		// Not parallel
		if ( kA !== kB ) {
			const x = + ( ( bA - bB ) / ( kB - kA ) ).toFixed( 12 )
			const y = + ( ( bB * kA - bA * kB ) / ( kA - kB ) ).toFixed( 12 )
			res.intersected = { x, y }
		}

		if ( kA === kB &&  bA === bB) {
			res.isSameLine = true
		}

		if ( kA === kB &&  bA !== bB) {
			res.isParallel = true
		}
	}

	if ( isLineAVertical() && !isLineBVertical() ) {
		const kB = getK( PB1, PB2 )
		const bB = getB( PB1, PB2 )

		const x = x1
		const y = + ( kB * x + bB ).toFixed( 12 )

		res.intersected = { x, y }
	}

	if ( !isLineAVertical() && isLineBVertical() ) {
		const kA = getK( PA1, PA2 )
		const bA = getB( PA1, PA2 )

		const x = x3
		const y = + ( kA * x + bA ).toFixed( 12 )

		res.intersected = { x, y }
	}

	if ( isLineAVertical() && isLineBVertical() ) {
		if ( x1 === x3 ) {
			res.isSameLine = true
		}

		if ( x1 !== x3 ) {
			res.isParallel = true
		}
	}

	return res

	function isLineBVertical() {
		return isVerticalLine( PB1, PB2 )
	}

	function isLineAVertical() {
		return isVerticalLine( PA1, PA2 )
	}

	function isVerticalLine( point1, point2 ) {
		const { x: x1, y: y1 } = point1
		const { x: x2, y: y2 } = point2
		return x1 === x2
	}

	function getB( point1, point2 ) {
		const { x: x1, y: y1 } = point1
		const { x: x2, y: y2 } = point2
		const k = getK( point1, point2 )
		const b: number = y1 - x1 * k
		return b
	}

	function getK( point1, point2 ) {
		const { x: x1, y: y1 } = point1
		const { x: x2, y: y2 } = point2
		return ( y2 - y1 ) / ( x2 - x1 )
	}
}
