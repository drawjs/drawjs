import MathVector from "../math/MathVector"
import isPointEqual from "./isPointEqual";
export default function( point, segmentLine: LineTwoPoints ) {
	const P: Point2D = point
	const A: Point2D = segmentLine[ 0 ]
	const B: Point2D = segmentLine[ 1 ]

	const AP: MathVector = new MathVector( A, P )
	const PB: MathVector = new MathVector( P, B )

	const res: boolean = AP.absoluteParallelWith( PB ) || isPointEqual( P, A ) || isPointEqual( P, B )
	return res
}
