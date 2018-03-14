import connectPointsToPath from "./connectPointsToPath"

export default function( points: Point2D[], deltaT = 0.001, path: Path2D = new Path2D() ) {
	if ( points.length <= 1 ) {
		return null
	}

	const delta = deltaT < 1 ? deltaT : 1
	let allPoints = []
	const lastPoint: Point2D = points[ points.length - 1 ]

	allPoints.push( points[ 0 ] )

	for ( let t = delta; t <= 1; t += delta ) {
		const point = bezier( points, t )
		allPoints.push( point )
	}

	allPoints.push( lastPoint )

	connectPointsToPath( allPoints, path )

	return path
}

function bezier( points, t ) {
	// Calculating points
	let calculating = points
	let PFinal

	iterate()

	return PFinal

	function iterate() {
		const { length } = calculating
		if ( length > 1 ) {
			const newCalculating = []
			for ( let i = 0; i < length - 1; i++ ) {
				const A = calculating[ i ]
				const B = calculating[ i + 1 ]
				const P = getPointOnLine( A, B, t )

				newCalculating.push( P )
			}

			calculating = newCalculating
			iterate()
			return
		}

		if ( length === 1 ) {
			PFinal = calculating[ 0 ]
		}
	}

	function getPointOnLine( Point1, Point2, t ) {
		const Point = {
			x: Point1.x + t * ( Point2.x - Point1.x ),
			y: Point1.y + t * ( Point2.y - Point1.y )
		}
		return Point
	}
}
