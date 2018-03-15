export default function( points: Point2D[] ) {
	const { length } = points

	const sum: Point2D = points.reduce( add )
	const { x, y } = sum
	const res: Point2D = {
		x: x / length,
		y: y / length
	}
	return res

	function add( { x, y }: Point2D, { x: currentX, y: currentY }: Point2D ) {
		return {
			x: x + currentX,
			y: y + currentY
		}
	}
}
