import Cell from "../Cell"
import { isNotNil } from "../../util/index"
import Particle from "../Particle"

const { min, max, abs } = Math

export default class Selector extends Particle {
	startPoint: Point2DInitial

	endPoint: Point2DInitial

	shouldSelect: boolean = false

	constructor( props ) {
		super( props )
	}

	get path(): Path2D {
		const path = new Path2D()
		const { left, top, width, height } = this

		path.rect( left, top, width, height )

		return path
	}

	get left(): number {
		const res = Math.min( this.startPoint.x, this.endPoint.x )
		return res
	}

	get top(): number {
		const res = Math.min( this.startPoint.y, this.endPoint.y )
		return res
	}

	get width(): number {
		const res = Math.abs( this.endPoint.x - this.startPoint.x )
		return res
	}

	get height(): number {
		const res = Math.abs( this.endPoint.y - this.startPoint.y )
		return res
	}

	render() {
		const { ctx } = this.getters
		if ( isNotNil( this.startPoint ) && isNotNil( this.endPoint ) ) {
			ctx.save()

			ctx.fillStyle = "rgba(37, 145, 293, 0.1)"
			ctx.fill( this.path )

			ctx.lineWidth = 1
			ctx.strokeStyle = "#b1b1f3"
			ctx.stroke( this.path )

			ctx.restore()
		}
	}

	boundsInSelectionArea( bounds: Bounds ): boolean {
		let res: boolean = false
		const { left, right, top, bottom } = bounds

		const { startPoint: start, endPoint: end } = this

		if ( isNotNil( start ) && isNotNil( end ) ) {
			const selectorLeft = min( start.x, end.x )
			const selectorRight = max( start.x, end.x )
			const selectorTop = min( start.y, end.y )
			const selectorBottom = max( start.y, end.y )
			res =
				left >= selectorLeft &&
				right <= selectorRight &&
				top >= selectorTop &&
				bottom <= selectorBottom
		}

		return res
	}
}
