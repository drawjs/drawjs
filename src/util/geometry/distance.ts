const { sqrt, pow } = Math


export default function ( point1: Point2D, point2: Point2D ) {
	const { x: x1, y: y1 } = point1
	const { x: x2, y: y2 } = point2
	return sqrt(
		pow( x2 - x1, 2 ) +
		pow( y2 - y1, 2 )
	)
}
