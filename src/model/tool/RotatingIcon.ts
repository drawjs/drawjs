import * as _ from "lodash"

import Geometry from "../Geometry"
import Cell from "../Cell"
import { ROTATE_ICON } from "store/constant_cellTypeList"
import { getPointAngleToOrigin } from 'util/index'

export default class RotatingIcon extends Cell {
	public instance: any
	public _centerX: number
	public _centerY: number
	public _size: number
	public _type: string = ROTATE_ICON
	public _angle: number

	public _iconImage: HTMLImageElement = new Image()
	get path(): Path2D {
		const path = new Path2D()
		path.rect(
			this._centerX - this._size / 2,
			this._centerY - this._size / 2,
			this._size,
			this._size
		)
		return path
	}

	get instanceCenterToThisCenter(): number {
		let res = null
		const instanceCenterX = this.instance.left + this.instance.width / 2
		const instanceCenterY = this.instance.top + this.instance.height / 2
		res = Math.sqrt(
			Math.pow( instanceCenterX - this._centerX, 2 ) +
				Math.pow( instanceCenterY - this._centerY, 2 )
		)
		return res
	}

	constructor( props ) {
		super( props )

		const { instance } = props

		this.instance = instance

		this._iconImage.src = "../../asset/svg/rotate-icon.svg"

		// this._iconImage.addEventListener( 'mousedown', this._clickListener )
		// this._instance
	}

	public renderByInstance( {
		_centerX = 25,
		_centerY = 25,
		_size = 50,
		angle = 0
	}: {
		_centerX?: number
		_centerY?: number
		_size?: number
		angle: number
	} ) {
		this._centerX = _centerX
		this._centerY = _centerY
		this._size = _size
		this._angle = angle

		this.draw.ctx.save()
		this.draw.ctx.translate( this._centerX, this._centerY )
		this.draw.ctx.drawImage(
			this._iconImage,
			-this._size / 2,
			-this._size / 2,
			this._size,
			this._size
		)
		this.draw.ctx.translate( 0, 0 )
		this.draw.ctx.restore()
	}

	containPoint( x, y ): boolean {
		let res = this.draw.ctx.isPointInPath( this.path, x, y )

		return res
	}

	// ******* Drag ******
	public _updateDrag( event ) {
		let angle = 0
		const deltaX = event.x - this._prevDraggingPoint.x
		const deltaY = event.y - this._prevDraggingPoint.y

		const instanceCenterX = this.instance.left + this.instance.width / 2
		const instanceCenterY = this.instance.top + this.instance.height / 2

		angle = getPointAngleToOrigin( {
			x: event.x - this.draw.canvasLeft - instanceCenterX,
			y: event.y - this.draw.canvasTop  - instanceCenterY,
		} )

		console.log( {
			x: event.x - this.draw.canvasLeft - instanceCenterX,
			y: instanceCenterY - this.draw.canvasTop  - event.y,
		} )

		this._updatePrevDraggingPoint( event )

		console.log( angle * this.RADIAN_TO_DEGREE )

		// const r = this.instanceCenterToThisCenter

		// angle = 2 * Math.asin(
		// 	Math.sqrt( Math.pow( deltaX, 2 ) + Math.pow( deltaY, 2 ) )  / r
		// )

		this.instance.angle = angle * this.RADIAN_TO_DEGREE

		this.draw.render()
	}
	// ******* Drag ******
}
