import * as _ from 'lodash'

import Graph from 'model/Graph'
import * as cellTypeList from 'store/constant_cellTypeList'
import * as i from "interface/index"


export default class Rect extends Graph{
	private _prevDraggingPoint: i.Point

	get renderPath(): Path2D {
		const path = new Path2D()
		path.rect(this.left, this.top, this.width, this.height)
		return path
	}

	constructor(
		{
			top,
			left,
			width,
			height,
			fill,
			angle,
			draggable = false,
			isSelected,
		}:
		{
			top: number,
			left: number,
			width: number,
			height: number,
			fill: string,
			angle: number,
			draggable: boolean,
			isSelected: boolean,
		}
	) {
		super( {
			top,
			left,
			width,
			height,
			fill,
			angle,
			draggable,
			isSelected,
		} )
		this.type = cellTypeList.RECT
		this.draggable = true
	}

	public render( ctx: CanvasRenderingContext2D ) {
		super.render( ctx )

		ctx.save()
		ctx.fillStyle = this.fill
		// ctx.rotate((Math.PI / 180) * this.angle)
		ctx.fill( this.renderPath )

		ctx.restore()


		function cloneDeepWithCustomizer( value ): void {
			const type = typeof value
		}
	}

	public containPoint( x, y ) {
		return this.draw.ctx.isPointInPath( this.renderPath, x, y )
		// return (
		// 	x >= this.left &&
		// 	x <= this.left + this.width &&
		// 	y >= this.top &&
		// 	y <= this.top + this.height
		// )
	}


	// ******* Drag ******
	private _updatePrevDraggingPoint( event ) {
		this._prevDraggingPoint = {
			x: event.x,
			y: event.y,
		}
	}
	private _updateDrag( event ) {
		this.left = this.left + event.x - this._prevDraggingPoint.x
		this.top = this.top + event.y - this._prevDraggingPoint.y

		this._updatePrevDraggingPoint( event )
	}
	private _startDrag( event ): void {
		this._updatePrevDraggingPoint( event )
	}
	private _dragging( event ): void {
		this._updateDrag( event )
	}
	private _stopDrag( event ): void {
		this._updateDrag( event )
	}
	// ******* Drag ******
}
