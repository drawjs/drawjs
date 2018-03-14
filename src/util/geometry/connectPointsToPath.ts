export default function( points, path: Path2D ) {
	points.map( connect )

	return path

	function connect( point, index, points ) {
		const { length } = points

		path.lineTo( point.x, point.y )
	}
}
