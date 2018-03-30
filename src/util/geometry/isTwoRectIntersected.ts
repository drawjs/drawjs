const { abs } = Math

export default function(
	rect1Center: Point2D,
	rect1Left: number,
	rect1Top: number,
	rect2Center: Point2D,
	rect2Left: number,
	rect2Top: number
) {
	const O1 = rect1Center
	const { x: x1, y: y1 } = O1
	const left1 = rect1Left
	const top1 = rect1Top

	const O2 = rect2Center
	const { x: x2, y: y2 } = O2
	const left2 = rect2Left
	const top2 = rect2Top

	const w1 = ( x1 - left1 ) * 2
	const h1 = ( y1 - top1 ) * 2

	const w2 = ( x2 - left2 ) * 2
	const h2 = ( y2 - top2 ) * 2

	const absDeltaX = abs( x2 - x1 )
	const absDeltaY = abs( y2 - y1 )

	const res: boolean = ( absDeltaX <= ( w1 / 2 + w2 / 2 ) ) && ( absDeltaY <= ( h1 / 2 + h2 / 2 ) )
	return res
}
