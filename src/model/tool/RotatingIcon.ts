import * as _ from "lodash"

import Geometry from "../Geometry"
import Cell from "../Cell"
import { ROTATE_ICON } from "store/constant_cellTypeList"
import { getPointAngleToOrigin } from 'util/index'
import * as i from "interface/index"


export default class RotatingIcon extends Cell {
	public instance: any
	public _size: number = 15
	public _type: string = ROTATE_ICON

	public _iconImage: HTMLImageElement = new Image()
	get path(): Path2D {
		const path = new Path2D()
		path.rect(
			- this._size / 2,
			- this.length - this._size,
			this._size,
			this._size
		)
		return path
	}

	/**
	 * the length between instance center and the center of this
	 */
	get length(): number {
		const res = this.instance.height / 2 + this._size / 2
		return res
	}

	get instanceCenterX(): number {
		return this.instance.originX
	}

	get instanceCenterY(): number {
		return this.instance.originY
	}

	constructor( props ) {
		super( props )

		const { instance } = props

		this.instance = instance

		this._iconImage.src = "../../asset/svg/rotate-icon.svg"

		// this._iconImage.addEventListener( 'mousedown', this._clickListener )
		// this._instance
	}

	public renderByInstance() {

		// console.log( this.renderCenterX, this.renderCenterY )

		this.draw.ctx.save()
		this.draw.ctx.translate( this.instanceCenterX, this.instanceCenterY )
		this.draw.ctx.rotate( this.instance.angle * this.DEGREE_TO_RADIAN )
		this.draw.ctx.drawImage(
			this._iconImage,
			- this._size / 2,
			-this.length - this._size,
			this._size,
			this._size
		)
		this.draw.ctx.translate( 0, 0 )
		this.draw.ctx.restore()
	}

	containPoint( x, y ): boolean {
		let transformedPoint = this.getTransformedPoint( { x, y } )

		// console.log( transformedPoint )

		let res = this.draw.ctx.isPointInPath( this.path, transformedPoint.x, transformedPoint.y )

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
			x: x - this.instance.originX,
			y: y - this.instance.originY
		}

		resPoint = this.rotatePoint( resPoint, -this.instance.angle )

		const res = {
			x: resPoint.x,
			y: resPoint.y
		}
		return res
	}

	// ******* Drag ******
	public _updateDrag( event ) {
		let radianAngle = 0
		let deltaAngle = 0
		const deltaX = event.x - this._prevDraggingPoint.x
		const deltaY = event.y - this._prevDraggingPoint.y

		radianAngle = getPointAngleToOrigin( {
			x: event.x - this.draw.canvasLeft - this.instanceCenterX,
			y: event.y - this.draw.canvasTop  - this.instanceCenterY,
		} ) + Math.PI / 2

		this._updatePrevDraggingPoint( event )

		this.instance.angle = radianAngle * this.RADIAN_TO_DEGREE

		this.draw.render()
	}
	// ******* Drag ******
}
