interface Result {
	// Not at the same line
	isParallel: boolean
	intersected: Point2D
}

/**
 * Algorithm:
 * y = kx + b
 */
export default function( line1: LineTwoPoints, line2: LineTwoPoints ): Result {
	let res: Result = {
		isParallel : false,
		intersected: null
	}

	const P11 = line1[ 0 ]
	const P12 = line1[ 1 ]

	const { x: x11, y: y11 } = P11
	const { x: x12, y: y12 } = P12

	const A1 = y12 - y11
	const B1 = x11 - x12
	const C1 = A1 * x11 + B1 * y11

	const P21 = line2[ 0 ]
	const P22 = line2[ 1 ]

	const { x: x21, y: y21 } = P21
	const { x: x22, y: y22 } = P22

	const A2 = y22 - y21
	const B2 = x21 - x22
	const C2 = A2 * x21 + B2 * y21

	const delta = A1 * B2 - A2 * B1

	if ( delta === 0 ) {
		res.isParallel = true
	} else {
		res.intersected = {
			x: ( B2 * C1 - B1 * C2 ) / delta,
			y: ( A1 * C2 - A2 * C1 ) / delta
		}
	}

	return res

	// const PA1: Point2D = lineA[ 0 ]
	// const PA2: Point2D = lineA[ 1 ]

	// const { x: x1, y: y1 } = PA1
	// const { x: x2, y: y2 } = PA2

	// const PB1: Point2D = lineB[ 0 ]
	// const PB2: Point2D = lineB[ 1 ]

	// const { x: x3, y: y3 } = PB1
	// const { x: x4, y: y4 } = PB2

	// if ( !isLineAVertical() && !isLineBVertical() ) {
	// 	const kA = getK( PA1, PA2 )

	// 	const kB = getK( PB1, PB2 )

	// 	const bA = getB( PA1, PA2 )
	// 	const bB = getB( PB1, PB2 )

	// 	// Not parallel
	// 	if ( kA !== kB ) {
	// 		const x = + ( ( bA - bB ) / ( kB - kA ) ).toFixed( 12 )
	// 		const y = + ( ( bB * kA - bA * kB ) / ( kA - kB ) ).toFixed( 12 )
	// 		res.intersected = { x, y }
	// 	}

	// 	if ( kA === kB &&  bA === bB) {
	// 		res.isSameLine = true
	// 	}

	// 	if ( kA === kB &&  bA !== bB) {
	// 		res.isParallel = true
	// 	}
	// }

	// if ( isLineAVertical() && !isLineBVertical() ) {
	// 	const kB = getK( PB1, PB2 )
	// 	const bB = getB( PB1, PB2 )

	// 	const x = x1
	// 	const y = + ( kB * x + bB ).toFixed( 12 )

	// 	res.intersected = { x, y }
	// }

	// if ( !isLineAVertical() && isLineBVertical() ) {
	// 	const kA = getK( PA1, PA2 )
	// 	const bA = getB( PA1, PA2 )

	// 	const x = x3
	// 	const y = + ( kA * x + bA ).toFixed( 12 )

	// 	res.intersected = { x, y }
	// }

	// if ( isLineAVertical() && isLineBVertical() ) {
	// 	if ( x1 === x3 ) {
	// 		res.isSameLine = true
	// 	}

	// 	if ( x1 !== x3 ) {
	// 		res.isParallel = true
	// 	}
	// }

	// return res

	// function isLineBVertical() {
	// 	return isVerticalLine( PB1, PB2 )
	// }

	// function isLineAVertical() {
	// 	return isVerticalLine( PA1, PA2 )
	// }

	// function isVerticalLine( point1, point2 ) {
	// 	const { x: x1, y: y1 } = point1
	// 	const { x: x2, y: y2 } = point2
	// 	return x1 === x2
	// }

	// function getB( point1, point2 ) {
	// 	const { x: x1, y: y1 } = point1
	// 	const { x: x2, y: y2 } = point2
	// 	const k = getK( point1, point2 )
	// 	const b: number = y1 - x1 * k
	// 	return b
	// }

	// function getK( point1, point2 ) {
	// 	const { x: x1, y: y1 } = point1
	// 	const { x: x2, y: y2 } = point2
	// 	return ( y2 - y1 ) / ( x2 - x1 )
	// }
}
