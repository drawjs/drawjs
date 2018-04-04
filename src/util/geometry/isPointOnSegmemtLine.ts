import MathVector from "../math/MathVector"
export default function( point, segmentLine: LineTwoPoints ) {
	const P: Point2D = point
	const A: Point2D = segmentLine[ 0 ]
	const B: Point2D = segmentLine[ 1 ]

	const AB: MathVector = new MathVector( A, B )
	const AP: MathVector = new MathVector( A, P )

	const res: boolean = AB.parallelWith( AP )
	return res
}
