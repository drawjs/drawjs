import * as _ from "lodash"

import Graph from "model/Graph"
import RotatingIcon from '../tool/RotatingIcon'
import * as cellTypeList from "store/constant_cellTypeList"
import * as i from "interface/index"

export default class Rect extends Graph {
	public _rotatingIcon: RotatingIcon

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

	constructor( props ) {
		super( props )

		this.type = cellTypeList.RECT
		this.draggable = true

		this._rotatingIcon = new RotatingIcon( {
			instance: this,
			draw: this.draw
		} )
	}

	public render() {
		const ctx = this.draw.ctx
		super.render()

		ctx.save()
		ctx.translate( this.originX, this.originY )
		ctx.fillStyle = this.fill
		ctx.rotate( this.angle * this.DEGREE_TO_RADIAN )
		ctx.fill( this.renderPath )

		ctx.translate( 0, 0 )
		ctx.restore()

		this._rotatingIcon.renderByInstance()

		function cloneDeepWithCustomizer( value ): void {
			const type = typeof value
		}
	}

	public containPoint( x, y ): boolean {
		let res = false
		const relativePoint = this.getTransformedPoint( { x, y } )
		res = this.draw.ctx.isPointInPath( this.renderPath, relativePoint.x, relativePoint.y )
		return res

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

		this.draw.render()
	}
	// ******* Drag ******
}
