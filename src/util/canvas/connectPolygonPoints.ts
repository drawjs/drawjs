export default function( points: Point2D[] ) {
	let path: Path2D = new Path2D()

	points.map( connect )

	return path

	function connect( point: Point2D, index: number, points: Point2D[] ) {
		const { length }: Point2D[] = points

		if ( index === 0 ) {
			path.moveTo( point.x, point.y )
		}
		if ( index !== 0 ) {
			path.lineTo( point.x, point.y )
		}
		if ( index === length - 1 ) {
			const firstPoints: Point2D = points[ 0 ]
			path.lineTo( firstPoints.x, firstPoints.y )
		}
	}
}
