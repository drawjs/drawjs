export default function ( P: Point2D, rectCenter: Point2D, rectLeft: number, rectTop ): boolean {
	const O: Point2D = rectCenter
	const { x: ox, y: oy }: Point2D = O

	const left = rectLeft
	const top = rectTop

	const w: number = ( ox - left ) * 2
	const h: number = ( oy - top ) * 2

	const right = left + w
	const bottom = top + h

	const { x, y }: Point2D = P


	const res: boolean =  x >= left && x <= right && y >= top && y <= bottom
	return res
}
