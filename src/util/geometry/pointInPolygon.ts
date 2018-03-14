type Segments = Point2D[]

export default function pointInPolygon( point: Point2D, points: Point2D[] ) {
	return pointInPolygonWindingNumber( point, points )
}

/**
 * Get area to check if point P is at the left or left side of vector from L0 to L1
 * Attention: L0 should be the bottom of L1( clockwise )
 */
function getArea( L0: Point2D, L1: Point2D, P: Point2D ) {
	const { x: x0, y: y0 }: Point2D = L0
	const { x: x1, y: y1 }: Point2D = L1
	const { x: xp, y: yp }: Point2D = P

	/**
	 * http://geomalgorithms.com/a01-_area.html
	 */
	return ( x1 - x0 ) * ( yp - y0 ) - ( xp - x0 ) * ( y1 - y0 )
}

/**
 * Check if point P is on the left side of vector from L0 to L1
 * Area llgorithm: http://geomalgorithms.com/a01-_area.html
 */

function isLeft( L0: Point2D, L1: Point2D, P: Point2D ) {
	const area: number = getArea( L0, L1, P )
	return area > 0
}

/**
 * Check if point P is on the right side of vector from L0 to L1
 * Area llgorithm: http://geomalgorithms.com/a01-_area.html
 */

function isRight( L0: Point2D, L1: Point2D, P: Point2D ) {
	const area: number = getArea( L0, L1, P )
	return area < 0
}

/**
 * Check if point P is inside of polygon with winding number algorithm
 * Algorithm: http://geomalgorithms.com/a03-_inclusion.html
 * @param {Point2D} P point P
 * @param {Point2D[]} polygonVertices vertices of polygon path in clockwise or counterclockwise order
 */

function pointInPolygonWindingNumber( P: Point2D, polygonVertices: Point2D[] ) {
	/**
	 * Winding nunebr
	 */
	let wn = 0

	let points: Point2D[] = polygonVertices.slice()

	if ( polygonVertices.length > 0 ) {
		const first: Point2D = polygonVertices[ 0 ]
		points.push( first )
	}

	for ( let i: number = 0; i < points.length - 1; i++ ) {
		const V0: Point2D = points[ i ]
		const V1: Point2D = points[ i + 1 ]

		const { x: x0, y: y0 }: Point2D = V0
		const { x: x1, y: y1 }: Point2D = V1
		const { x: xp, y: yp }: Point2D = P

		/**
		 * Upward
		 */
		if ( y0 <= yp && y1 > yp && isLeft( V0, V1, P ) ) {
			wn = wn + 1
		}
		/**
		 * Downward
		 */
		if ( y0 > yp && y1 <= yp && isRight( V0, V1, P ) ) {
			wn = wn - 1
		}
	}

	const pointOnPolygonPath: boolean = isPointOnPolygonPathEdge( P, points )
	const res: boolean = pointOnPolygonPath || wn !== 0

	return res
}

function isPointOnPoints( P: Point2D, points: Point2D[] ) {
	const res: boolean = points.some( isP )

	function isP( point: Point2D ): boolean {
		return point.x === P.x && point.y === P.y
	}

	return res
}

function isPointOnAnyPolygonSegment( P: Point2D, polygonVertices: Point2D[] ) {
	let res: boolean = false
	for ( let i: number = 0; i < polygonVertices.length - 1; i++ ) {
		const V0: Point2D = polygonVertices[ i ]
		const V1: Point2D = polygonVertices[ i + 1 ]
		const segment: Segments = [ V0, V1 ]

		if ( isPointOnSegment( P, segment ) ) {
			res = true
			return res
		}
	}
	return res
}

function isPointOnSegment( P: Point2D, segment: Segments ) {
	let res: boolean = false
	if ( isPointOnPoints( P, segment ) ) {
		res = true
		return res
	}

	const { x: x0, y: y0 }: Point2D = segment[ 0 ]
	const { x: x1, y: y1 }: Point2D = segment[ 1 ]
	const { x: xp, y: yp }: Point2D = P

	const vt: number = ( y1 - y0 ) / ( x1 - x0 )
	const b: number = y0 - vt * x0
	res = yp === vt * xp + b

	return res
}

/**
 * Whether point is on the edge of polygon path
 */
function isPointOnPolygonPathEdge(
	P: Point2D,
	polygonVertices: Point2D[]
): boolean {
	const res: boolean = isPointOnAnyPolygonSegment( P, polygonVertices )
	return res
}
