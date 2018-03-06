import getters from "../../store/draw/getters"

const { abs } = Math

export default class Grid {
	canvas: HTMLCanvasElement
	zoom: number = 1
	pan: Point2D = {
		x: 0,
		y: 0
	}

	static INTERVAL: number = 10
	static DEFAULT_ZOOM: number = 10
	static DEFAULT_PAN: Point2D = {
		x: 0,
		y: 0
	}

	interval: number = Grid.INTERVAL

	get ctx(): CanvasRenderingContext2D {
		return getters.ctx
	}

	get width(): number {
		return ( abs( getters.panX ) + getters.canvasWidth ) / getters.zoom + this.interval
	}

	get height(): number {
		return ( abs( getters.panY ) + getters.canvasHeight ) / getters.zoom + this.interval
	}

	get left(): number {
		return -Math.round( getters.panX / this.interval ) * this.interval - this.interval
	}

	get right(): number {
		return this.left + this.width
	}

	get top(): number {
		return -Math.round( getters.panY / this.interval ) * this.interval - this.interval
	}

	get bottom(): number {
		return this.top + this.height
	}

	get path(): Path2D {
		let path = new Path2D()

		const { width, height, interval, left, top, right, bottom } = this

		/**
		 * Draw vertical lines
		 */
		for ( let i = 0, x = 0; x < right; i++ ) {
			x = i * interval
			path.moveTo( left + x + interval, top )
			path.lineTo( left + x + interval, bottom )
		}
		/**
		 * Draw horizontal lines
		 */
		for ( let i = 0, y = 0; y < bottom; i++ ) {
			y = i * interval
			path.moveTo( left, top + y + interval )
			path.lineTo( right, top + y + interval )
		}

		return path
	}

	constructor( canvas: HTMLCanvasElement ) {
		this.canvas = canvas
	}

	render(
		interval = Grid.INTERVAL,
		zoom: number = Grid.DEFAULT_ZOOM,
		pan: Point2D = Grid.DEFAULT_PAN,
	) {
		this.interval = interval
		this.zoom = zoom
		this.pan = pan

		const { ctx } = getters
		const { path } = this
		ctx.save()
		ctx.lineWidth = 1
		ctx.strokeStyle = "grey"
		ctx.stroke( path )
		ctx.restore()
	}
}
