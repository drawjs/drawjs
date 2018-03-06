import getters from "../../store/draw/getters"

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

	get basicWidth(): number {
		return this.canvas.getBoundingClientRect().width
	}

	get basicHeight(): number {
		return this.canvas.getBoundingClientRect().height
	}

	get width(): number {
		// if ( this.zoom < 1 ) {
		// 	return this.basicWidth / this.zoom
		// }
		return this.basicWidth
	}

	get height(): number {
		// if ( this.zoom < 1 ) {
		// 	return this.basicHeight / this.zoom
		// }
		return this.basicHeight
	}

	get startX(): number {
		return -( this.width - this.basicWidth ) / 2
	}

	get startY(): number {
		return -( this.height - this.basicHeight ) / 2
	}

	get path(): Path2D {
		let path = new Path2D()

		const { width, height, interval, startX, startY } = this
		const left = -300
		const right = left + width
		const top = -300
		const bottom = top + height

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
		pan: Point2D = Grid.DEFAULT_PAN
	) {
		this.interval = interval
		this.zoom = zoom
		this.pan = pan

		const { ctx } = getters
		const { path } = this
		// getters.renderer.resetTransform()
		ctx.save()
		ctx.lineWidth = 1
		ctx.strokeStyle = "grey"
		ctx.stroke( path )
		ctx.restore()
		// getters.renderer.setTransformViewPort()
	}
}
