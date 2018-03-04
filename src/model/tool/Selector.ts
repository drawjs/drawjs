import Cell from "../Cell"
import getters from "../../store/draw/getters"
import {
	DESELECT_ALL_CELLS,
	SELECT_MOST_TOP_CELL_FOCUSED,
	SELECT_CELLS_IN_SELECTOR_RIGION
} from "../../store/draw/actions"
import sharedGetters from "../../shared/sharedGetters"
import { isNotNil } from "util/index"

export default class Selector {
	startPoint: Point2D

	endPoint: Point2D

	shouldSelect: boolean = false

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

	constructor() {
		// const self = this

		// const canvas = getters.canvas

		// canvas.removeEventListener( "mousedown", mousedownListener )
		// canvas.addEventListener( "mousedown", mousedownListener )

		// canvas.removeEventListener( "mousemove", mousemoveListener )
		// canvas.addEventListener( "mousemove", mousemoveListener )

		// canvas.removeEventListener( "mouseup", mouseupListener )
		// canvas.addEventListener( "mouseup", mouseupListener )

		// function mousedownListener( event ) {
		// 	const point = getters.getPoint( event )
		// 	if ( getters.pointOnEmpty( point ) ) {
		// 		DESELECT_ALL_CELLS()

		// 		startSelect( event )
		// 	}

		// 	if ( sharedGetters.pointOnSelectionExcludingCells( point ) ) {
		// 		return
		// 	}

		// 	if ( sharedGetters.pointOnCellDeselected( point ) ) {
		// 		DESELECT_ALL_CELLS()

		// 		SELECT_MOST_TOP_CELL_FOCUSED( point )
		// 	}

		// 	if ( sharedGetters.pointOnCellSelected( point ) ) {
		// 		ENABLE_CELLS_SELECTED_DRAG()
		// 		return
		// 	}
		// }

		// function mousemoveListener( event ) {
		// 	self.shouldSelect && selecting( event )
		// }

		// function mouseupListener( event ) {
		// 	self.shouldSelect = false
		// 	stopSelect( event )
		// }

		// function startSelect( event ) {
		// 	self.shouldSelect = true

		// 	self.startPoint = getters.getPoint( event )
		// 	getters.draw.render()
		// }

		// function selecting( event ) {
		// 	self.endPoint = getters.getPoint( event )
		// 	getters.draw.render()
		// }

		// function stopSelect( event ) {
		// 	SELECT_CELLS_IN_SELECTOR_RIGION()

		// 	self.startPoint = null
		// 	self.endPoint = null
		// 	getters.draw.render()
		// }
	}

	render() {
		const ctx = getters.ctx
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
