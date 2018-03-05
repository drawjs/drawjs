export default function( point: Point2D, deltaX: number, deltaY: number ): Point2D {
	const res: Point2D = {
		x: point.x + deltaX,
		y: point.y + deltaY
	}
	return res
}
