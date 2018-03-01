export default function( point: Point2D, x: number, y: number ): Point2D {
	const res: Point2D = {
		x: point.x + x,
		y: point.y + y
	}
	return res
}
