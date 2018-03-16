export default function ( point: Point2D, kX: number, kY: number, center: Point2D ) {
	const { x, y }: Point2D = point
	const { x: cx, y: cy }: Point2D = center
	const newPoint: Point2D = {
		x: cx + ( x - cx ) * kX,
		y: cy + ( y - cy ) * kY,
	}

	return newPoint
}
