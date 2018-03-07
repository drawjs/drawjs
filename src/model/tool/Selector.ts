import Cell from "../Cell"
import { isNotNil } from "util/index"
import Particle from '../Particle';

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

	rectInSelectionArea(
		left: number,
		top: number,
		width: number,
		height: number
	): boolean {
		const { startPoint: start, endPoint: end } = this
		if ( isNotNil( start ) && isNotNil( end ) ) {
			const selectorLeft = Math.min( start.x, end.x )
			const selectorTop = Math.min( start.y, end.y )
			const selectorWidth = Math.abs( end.x - start.x )
			const selectorHeight = Math.abs( end.y - start.y )
			return (
				left >= selectorLeft &&
				top >= selectorTop &&
				left + width <= selectorLeft + selectorWidth &&
				top + height <= selectorTop + selectorHeight
			)
		}

		return false
	}
}
