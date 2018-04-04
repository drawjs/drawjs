import intersect from "./intersect"
import MathVector from "../math/MathVector"
import isPointOnSegmemtLine from "./isPointOnSegmemtLine"

export default function(
	segmentLine1: LineTwoPoints,
	segmentLine2: LineTwoPoints
) {
	let res: boolean = false
	const P1A: Point2D = segmentLine1[ 0 ]
	const P1B: Point2D = segmentLine1[ 1 ]

	const P2A: Point2D = segmentLine2[ 0 ]
	const P2B: Point2D = segmentLine2[ 1 ]

	const intersectdRes = intersect( segmentLine1, segmentLine2 )
	const { intersected, isSameLine } = intersectdRes

	if ( intersected !== null ) {
		res =
			isPointOnSegmemtLine( intersected, segmentLine1 ) &&
			isPointOnSegmemtLine( intersected, segmentLine2 )
	}

	if ( isSameLine ) {
		res =
			isPointOnSegmemtLine( P1A, segmentLine2 ) ||
			isPointOnSegmemtLine( P1B, segmentLine2 ) ||
			isPointOnSegmemtLine( P2A, segmentLine1 ) ||
			isPointOnSegmemtLine( P2B, segmentLine1 )
	}

	return res
}
