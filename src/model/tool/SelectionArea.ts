import * as _ from "lodash"

import Geometry from "model/Geometry"
import Cell from "model/Cell"
import {
	coupleSelectCell,
	coupleEnableCellDrag,
	coupleIsMouseDownToPan
} from "mixin/index"
import selectionExcludingCellTypes from "store/exclude/selectionExcludingCellTypes"
import { log } from "util/index"
import getters from "store/draw/getters"

export default class SelectionArea extends Geometry {
	public startPoint: Point2D
	public endPoint: Point2D
	public _isSelecting: boolean = false

	constructor( props ) {
		super( props )

		this._initialize()
	}
	get computedWidth(): number {
		const res = Math.abs( this.endPoint.x - this.startPoint.x )
		return res
	}
	get computedHeight(): number {
		const res = Math.abs( this.endPoint.y - this.startPoint.y )
		return res
	}
	get computedLeft(): number {
		const res = Math.min( this.startPoint.x, this.endPoint.x )
		return res
	}
	get computedTop(): number {
		const res = Math.min( this.startPoint.y, this.endPoint.y )
		return res
	}
	get path(): Path2D {
		const path = new Path2D()

		path.rect(
			-this.computedWidth / 2,
			-this.computedHeight / 2,
			this.computedWidth,
			this.computedHeight
		)
		return path
	}
	get originX(): number {
		return this.computedLeft + this.computedWidth / 2
	}

	get originY(): number {
		return this.computedTop + this.computedHeight / 2
	}

	get selectedCells(): Cell[] {
		let res: Cell[] = []
		res = getters.cellList.filter( isSelected )

		function isSelected( cell ): boolean {
			return cell.isSelected && cell.isSelected === true
		}

		return res
	}

	get cellsInSelectionArea(): Cell[] {
		const self = this
		let res: Cell[] = []
		res = getters.cellList.filter( isCellInSelectionArea )

		function isCellInSelectionArea( props ): boolean {
			const { left, top, width, height } = props
			return self._isRectInSelectionArea( { left, top, width, height } )
		}

		return res
	}

	public _initialize(): void {
		getters.canvas.removeEventListener( "mousedown", this._mousedownListener )
		getters.canvas.addEventListener( "mousedown", this._mousedownListener )

		getters.canvas.removeEventListener( "mousemove", this._mousemoveListener )
		getters.canvas.addEventListener( "mousemove", this._mousemoveListener )

		getters.canvas.removeEventListener( "mouseup", this._mouseupListener )
		getters.canvas.addEventListener( "mouseup", this._mouseupListener )
	}

	public _mousedownListener = event => {
		if ( coupleIsMouseDownToPan( this.draw.zoomPan, event ) ) {
			return
		}

		if ( this._isPointOnEmptyArea( event ) ) {
			this._unselectCells()

			this._isSelecting = true
			this.startSelect( event )
			return
		}

		if ( this._isPointOnSelectionExcludingCell( event ) ) {
			return
		}

		if ( this._isPointOnUnselectedCell( event ) ) {
			this._unselectCells()
			const point = getters.getPoint( event )
			const mostTopCell = getters.getMostTopCellFocus( point )
			this._selectCell( mostTopCell )
			return
		}

		if ( this._isPointOnSelectedCell( event ) ) {
			this._enableSelectedCellsDrag( event )
			return
		}
	}

	public _mousemoveListener = event => {
		this._isSelecting && this.selecting( event )
	}

	public _mouseupListener = event => {
		this._isSelecting = false
		this.stopSelect( event )
	}

	public startSelect( event ): void {
		this.startPoint = {
			x: event.x - getters.canvasLeft,
			y: event.y - getters.canvasTop
		}
		this.draw.render()
	}

	public selecting( event ): void {
		this.endPoint = {
			x: event.x - getters.canvasLeft,
			y: event.y - getters.canvasTop
		}
		this.draw.render()
	}

	public stopSelect( event ): void {
		this._selectCells()

		this.startPoint = null
		this.endPoint = null
		this.draw.render()
	}

	private _isPointOnEmptyArea( event ): boolean {
		const point = getters.getPoint( event )
		const mostTopCell = getters.getMostTopCellFocus( point )
		return mostTopCell === null
	}

	private _isPointOnCell( event ): boolean {
		return !this._isPointOnEmptyArea( event )
	}

	private _isPointOnUnselectedCell( event ): boolean {
		const point = getters.getPoint( event )
		const mostTopCell = getters.getMostTopCellFocus( point )
		return mostTopCell && mostTopCell.isSelected === false
	}

	private _isPointOnSelectedCell( event ): boolean {
		const point = getters.getPoint( event )
		const mostTopCell = getters.getMostTopCellFocus( point )
		return mostTopCell && mostTopCell.isSelected === true
	}

	private _isPointOnSelectionExcludingCell( event ): boolean {
		const point = getters.getPoint( event )
		const mostTopCell = getters.getMostTopCellFocus( point )
		const res = _.includes( selectionExcludingCellTypes, mostTopCell.type )
		return mostTopCell && res
	}

	public _isRectInSelectionArea( { left, top, width, height } ): boolean {
		if ( !_.isNil( this.startPoint ) && !_.isNil( this.endPoint ) ) {
			const startPointTransformedInversely = this.draw.zoomPan.transformPointReversely(
				this.startPoint
			)
			const endPointTransformedInversely = this.draw.zoomPan.transformPointReversely(
				this.endPoint
			)

			const areaLeft = Math.min(
				startPointTransformedInversely.x,
				endPointTransformedInversely.x
			)
			const areaTop = Math.min(
				startPointTransformedInversely.y,
				endPointTransformedInversely.y
			)
			const areaWidth = Math.abs(
				endPointTransformedInversely.x -
					startPointTransformedInversely.x
			)
			const areaHeight = Math.abs(
				endPointTransformedInversely.y -
					startPointTransformedInversely.y
			)
			return (
				left >= areaLeft &&
				top >= areaTop &&
				left + width <= areaLeft + areaWidth &&
				top + height <= areaTop + areaHeight
			)
		}

		return false
	}

	public _selectCells() {
		this.cellsInSelectionArea.map( this._selectCell )
	}

	public _selectCell( cell ) {
		coupleSelectCell( cell, true )
	}

	public _unselectCells() {
		getters.cellList.map( unselectCell )

		function unselectCell( cell ) {
			coupleSelectCell( cell, false )
		}
	}

	public _enableSelectedCellsDrag( event ) {
		this.selectedCells.map( enableDrag )

		function enableDrag( cell ) {
			coupleEnableCellDrag( cell, event )
		}
	}

	public render(): void {
		const ctx = getters.ctx
		if ( !_.isNil( this.startPoint ) && !_.isNil( this.endPoint ) ) {
			ctx.save()

			ctx.translate( this.originX, this.originY )

			ctx.fillStyle = "rgba(37, 145, 293, 0.1)"
			ctx.fill( this.path )

			ctx.lineWidth = 1
			ctx.strokeStyle = "#b1b1f3"
			ctx.stroke( this.path )

			ctx.restore()
		}
	}

	public contain( x, y ) {}
}
