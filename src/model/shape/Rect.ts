import * as _ from "lodash"

import Graph from "model/Graph"
import * as cellTypeList from "store/constant_cellTypeList"
import * as i from "interface/index"

export default class Rect extends Graph {
	get renderPath(): Path2D {
		const path = new Path2D()
		path.rect( - this.width / 2, - this.height / 2, this.width, this.height )
		return path
	}

	constructor( {
		top,
		left,
		width,
		height,
		fill,
		angle,
		draggable = false,
		isSelected
	}: {
		top: number
		left: number
		width: number
		height: number
		fill: string
		angle: number
		draggable: boolean
		isSelected: boolean
	} ) {
		super( {
			top,
			left,
			width,
			height,
			fill,
			angle,
			draggable,
			isSelected
		} )
		this.type = cellTypeList.RECT
		this.draggable = true
	}

	public render( ctx: CanvasRenderingContext2D ) {
		super.render( ctx )

		ctx.save()
		ctx.translate(
			this.left + this.width / 2,
			this.top + this.height / 2,
		)
		ctx.fillStyle = this.fill
		ctx.rotate( this.angle * Math.PI / 180  )
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
	public _updateDrag( event ) {
		this.left = this.left + event.x - this._prevDraggingPoint.x
		this.top = this.top + event.y - this._prevDraggingPoint.y

		this._updatePrevDraggingPoint( event )
	}
	// ******* Drag ******
}
