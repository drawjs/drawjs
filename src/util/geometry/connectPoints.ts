export default function( points, path: Path2D = new Path2D() ) {

	points.map( connect )

	return path

	function connect( point, index, points ) {
		const { length } = points

		if ( index === 0 ) {
			path.moveTo( point.x, point.y )
		}
		if ( index !== 0 ) {
			path.lineTo( point.x, point.y )
		}
	}
}
