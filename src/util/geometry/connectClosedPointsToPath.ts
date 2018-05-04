import { isLast } from '../js/array';
export default function( points, path: Path2D ) {
	points.map( connect )

	return path

	function connect( point, index, points ) {
		const { length } = points

		path.lineTo( point.x, point.y )

		if ( isLast( index, points ) ) {
			const firstPoints = points[ 0 ]
			path.lineTo( firstPoints.x, firstPoints.y )
		}
	}
}
