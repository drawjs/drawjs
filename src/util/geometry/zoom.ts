export default function(
	center: Point2D = {
		x: 0,
		y: 0
	},
	rate: number,
	point: Point2D
): Point2D {
	const { x: cx, y: cy }: Point2D = center
	const { x, y }: Point2D = point

	const deltaX: number = ( x - cx ) * rate
	const deltaY: number = ( y - cy ) * rate

	const newPoint: Point2D = {
		x: cx + deltaX,
		y: cy + deltaY
	}
	return newPoint
}
