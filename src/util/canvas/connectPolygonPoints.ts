export default function( points: Point2D[], path2d: Path2D = new Path2D() ) {

	points.map( connect )

	return path2d

	function connect( point: Point2D, index: number, points: Point2D[] ) {
		const { length }: Point2D[] = points

		if ( index === 0 ) {
			path2d.moveTo( point.x, point.y )
		}
		if ( index !== 0 ) {
			path2d.lineTo( point.x, point.y )
		}
		if ( index === length - 1 ) {
			const firstPoints: Point2D = points[ 0 ]
			path2d.lineTo( firstPoints.x, firstPoints.y )
		}
	}
}
