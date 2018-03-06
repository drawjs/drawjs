export default class Grid {
	canvas: HTMLCanvasElement

	static INTERVAL: number = 10

	interval: number = Grid.INTERVAL

	get ctx(): CanvasRenderingContext2D {
		return this.canvas.getContext( "2d" )
	}

	get width(): number {
		return this.canvas.getBoundingClientRect().width
	}

	get height(): number {
		return this.canvas.getBoundingClientRect().height
	}

	get path(): Path2D {
		const { width, height, interval } = this

		let path = new Path2D()

		/**
		 * Draw vertical lines
		 */
		for ( let i = 0, x = 0; x < width; i++ ) {
			x = i * interval
			path.moveTo( x + interval, 0 )
			path.lineTo( x + interval, height )
		}
		/**
		 * Draw horizontal lines
		 */
		for ( let i = 0, y = 0; y < height; i++ ) {
			y = i * interval
			path.moveTo( 0, y + interval )
			path.lineTo( width, y + interval )
		}

		return path
	}

	constructor( canvas: HTMLCanvasElement ) {
		this.canvas = canvas
	}

	render( interval = Grid.INTERVAL ) {
		this.interval = interval

		const { ctx, path } = this
		ctx.save()
		ctx.lineWidth = 1
		ctx.strokeStyle = "grey"
		ctx.stroke( path )
		ctx.restore()
	}
}
