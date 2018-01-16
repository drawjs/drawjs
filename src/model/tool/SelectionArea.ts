import * as _ from "lodash"

import Geometry from "model/Geometry"
import * as interfaces from "interface/index"
import Cell from "model/Cell"
import { coupleSelectCell, coupleEnableCellDrag } from "mixin/index"
import selectionExcludingCellTypes from "store/selectionExcludingCellTypes";

export default class SelectionArea extends Geometry {
	public startPoint: interfaces.Point
	public endPoint: interfaces.Point
	public _isSelecting: boolean = false

	constructor(props) {
		super(props)

		this._initialize()
	}

	get selectedCells(): Cell[] {
		let res: Cell[] = []
		res = this.draw.cellList.filter(isSelected)

		function isSelected(cell): boolean {
			return cell.isSelected && cell.isSelected === true
		}

		return res
	}

	get cellsInSelectionArea(): Cell[] {
		const self = this
		let res: Cell[] = []
		res = this.draw.cellList.filter(isCellInSelectionArea)

		function isCellInSelectionArea(props): boolean {
			const { left, top, width, height } = props
			return self._isRectInSelectionArea({ left, top, width, height })
		}

		return res
	}

	public _initialize(): void {
		this.draw.canvas.removeEventListener(
			"mousedown",
			this._mousedownListener
		)
		this.draw.canvas.addEventListener("mousedown", this._mousedownListener)

		this.draw.canvas.removeEventListener(
			"mousemove",
			this._mousemoveListener
		)
		this.draw.canvas.addEventListener("mousemove", this._mousemoveListener)

		this.draw.canvas.removeEventListener("mouseup", this._mouseupListener)
		this.draw.canvas.addEventListener("mouseup", this._mouseupListener)
	}

	public _mousedownListener = event => {

		if (this._isPointOnEmptyArea(event)) {
			this._unselectCells()

			this._isSelecting = true
			this.startSelect(event)
			return
		}

		if (this._isPointOnSelectionExcludingCell(event)) {
			return
		}

		if (this._isPointOnUnselectedCell(event)) {
			this._unselectCells()
			const mostTopCell = this.draw._getMostTopCell(event)
			this._selectCell(mostTopCell)
			return
		}

		if (this._isPointOnSelectedCell(event)) {
			this._enableSelectedCellsDrag(event)
			return
		}
	}

	public _mousemoveListener = event => {
		this._isSelecting && this.selecting(event)
	}

	public _mouseupListener = event => {
		this._isSelecting = false
		this.stopSelect(event)
	}

	public startSelect(event): void {
		this.startPoint = {
			x: event.x - this.draw.canvasLeft,
			y: event.y - this.draw.canvasTop
		}
		this.draw.render()
	}

	public selecting(event): void {
		this.endPoint = {
			x: event.x - this.draw.canvasLeft,
			y: event.y - this.draw.canvasTop
		}
		this.draw.render()
	}

	public stopSelect(event): void {
		this._selectCells()

		this.startPoint = null
		this.endPoint = null
		this.draw.render()
	}

	private _isPointOnEmptyArea(event): boolean {
		const mostTopCell = this.draw._getMostTopCell(event)
		return mostTopCell === null
	}

	private _isPointOnCell(event): boolean {
		return !this._isPointOnEmptyArea(event)
	}

	private _isPointOnUnselectedCell(event): boolean {
		const mostTopCell = this.draw._getMostTopCell(event)
		return mostTopCell && mostTopCell.isSelected === false
	}

	private _isPointOnSelectedCell(event): boolean {
		const mostTopCell = this.draw._getMostTopCell(event)
		return mostTopCell && mostTopCell.isSelected === true
	}

	private _isPointOnSelectionExcludingCell(event): boolean {
		const mostTopCell = this.draw._getMostTopCell(event)
		const res = _.includes(selectionExcludingCellTypes, mostTopCell.type)
		return mostTopCell && res
	}

	public _isRectInSelectionArea({ left, top, width, height }): boolean {
		if (!_.isNil(this.startPoint) && !_.isNil(this.endPoint)) {
			const areaLeft = Math.min(this.startPoint.x, this.endPoint.x)
			const areaTop = Math.min(this.startPoint.y, this.endPoint.y)
			const areaWidth = Math.abs(this.endPoint.x - this.startPoint.x)
			const areaHeight = Math.abs(this.endPoint.y - this.startPoint.y)
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
		this.cellsInSelectionArea.map(this._selectCell)
	}

	public _selectCell(cell) {
		coupleSelectCell(cell, true)
	}

	public _unselectCells() {
		this.draw.cellList.map(unselectCell)

		function unselectCell(cell) {
			coupleSelectCell(cell, false)
		}
	}

	public _enableSelectedCellsDrag(event) {
		this.selectedCells.map(enableDrag)

		function enableDrag(cell) {
			coupleEnableCellDrag(cell, event)
		}
	}

	public render(): void {
		const ctx = this.draw.ctx
		if (!_.isNil(this.startPoint) && !_.isNil(this.endPoint)) {
			const width = Math.abs(this.endPoint.x - this.startPoint.x)
			const height = Math.abs(this.endPoint.y - this.startPoint.y)
			const left = Math.min(this.startPoint.x, this.endPoint.x)
			const top = Math.min(this.startPoint.y, this.endPoint.y)

			ctx.save()
			ctx.beginPath()
			ctx.rect(left, top, width, height)
			ctx.closePath()
			ctx.fillStyle = "rgba(37, 145, 293, 0.1)"
			ctx.fill()
			ctx.lineWidth = 1
			ctx.strokeStyle = "#b1b1f3"
			ctx.stroke()
			ctx.restore()
		}
	}

	public containPoint(x, y) { }
}
