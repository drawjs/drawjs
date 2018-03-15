const { PI } = Math

export default function( point: Point2D, canvas: HTMLCanvasElement, color: string = "red" ) {
	const ctx: CanvasRenderingContext2D = canvas.getContext( '2d' )
	ctx.save()

	const { x, y } = point

	ctx.beginPath()
	ctx.arc( x, y, 1, 0, PI * 2 )
	ctx.fillStyle = color
	ctx.fill()

	ctx.restore()
}
