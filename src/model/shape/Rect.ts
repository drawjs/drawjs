import * as _ from "lodash"

import Graph from "model/Graph"
import * as cellTypeList from "store/constant_cellTypeList"
import * as i from "interface/index"

export default class Rect extends Graph {
	get renderPath(): Path2D {
		const path = new Path2D()
		path.rect( -this.width / 2, -this.height / 2, this.width, this.height )
		return path
	}

	get originX(): number {
		return this.left + this.width / 2
	}

	get originY(): number {
		return this.top + this.height / 2
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
		ctx.translate( this.originX, this.originY )
		ctx.fillStyle = this.fill
		ctx.rotate( this.angle * this.DEGREE_TO_RADIAN )
		ctx.fill( this.renderPath )

		ctx.restore()

		function cloneDeepWithCustomizer( value ): void {
			const type = typeof value
		}
	}

	public containPoint( x, y ) {
		const relativePoint = this.getTransformedPoint( { x, y } )
		return this.draw.ctx.isPointInPath( this.renderPath, relativePoint.x, relativePoint.y )
	}

	/**
	 * Get the point
	 * which was tansformed or rotated reversely and
	 * was related to context origin of coordinate,
	 * when relevant context was rotated or transformed,
	 * to match original path
	 */
	public getTransformedPoint( {
		x,
		y
	}: {
		x: number
		y: number
	} ) {
		let resPoint: i.Point = {
			x: x - this.originX,
			y: y - this.originY
		}

		resPoint = this.rotatePoint( resPoint, -this.angle )

		const res = {
			x: resPoint.x,
			y: resPoint.y
		}
		return res
	}

	// ******* Drag ******
	public _updateDrag( event ) {
		this.left = this.left + event.x - this._prevDraggingPoint.x
		this.top = this.top + event.y - this._prevDraggingPoint.y

		this._updatePrevDraggingPoint( event )
	}
	// ******* Drag ******
}
