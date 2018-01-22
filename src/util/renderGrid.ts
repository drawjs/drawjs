import { Point } from 'interface/index';


export default function renderGrid( canvas: HTMLCanvasElement, zoom: number, panPoint: Point ) {
	const ctx = canvas.getContext( '2d' )
	const width = canvas.width
	const height = canvas.height
	const spaceSmall = 10 * zoom
	const spaceBig = 50 * zoom

	renderGridBySpace( spaceSmall, () => {
		ctx.setLineDash( [ 2, 1 ] )
		ctx.strokeStyle = '#ddd'
	} )
	renderGridBySpace( spaceBig, () => {
		ctx.strokeStyle = '#ddd'
	} )


	function renderGridBySpace( space: number, beforeStrokeFn?: Function ) {
		let path = new Path2D()

		ctx.save()
		ctx.translate( 0, 0 )

		for ( let i = 1; i < width - 1; i++ ) {
			const x = i * space
			path.moveTo( x, 0 )
			path.lineTo( x, height )

			const y = i * space
			path.moveTo( 0, y)
			path.lineTo( width, y )
		}

		ctx.lineWidth = 1
		ctx.strokeStyle = 'grey'
		beforeStrokeFn && beforeStrokeFn()
		ctx.stroke( path )

		ctx.restore()
	}
}
