export default function ( point1: Point2D, point2: Point2D ) {
	const { x: x1, y: y1 } = point1
	const { x: x2, y: y2 } = point2
	return {
		x: ( x1 + x2 ) / 2,
		y: ( y1 + y2 ) / 2,
	}
}
