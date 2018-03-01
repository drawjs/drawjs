export default function ( center: Point2D, width: number, height: number ) {
	const { x, y }: Point2D = center
	/**
	 * Width cell
	 */
	const halfW = width / 2

	/**
	 * Height cell
	 */
	const halfH = height / 2

	const left = x - halfW
	const right = x + halfW
	const top = y - halfH
	const bottom = y + halfH

	const res: Point2D[] = [
		{
			x: left,
			y: top
		},
		{
			x: right,
			y: top
		},
		{
			x: right,
			y: bottom
		},
		{
			x: left,
			y: bottom
		},
	]

	return res
}
