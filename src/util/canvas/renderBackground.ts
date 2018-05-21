export default function ( canvas: HTMLCanvasElement, color: string ) {
	const { width, height } = canvas
	const ctx: CanvasRenderingContext2D = canvas.getContext( '2d' )
	ctx.save()
	ctx.fillStyle = color
	ctx.fillRect( 0, 0, width, height )
	ctx.restore()
}
