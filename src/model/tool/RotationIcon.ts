import * as _ from "lodash"

import Geometry from "model/Geometry"
import Cell from "model/Cell"
import { ROTATE_ICON } from "store/constant_cellTypeList"
import { getPointAngleToOrigin } from "util/index"
import * as i from "interface/index"
import { coupleRotatingCell, coupleSelectCell, transformCenterPointForContext } from 'mixin/index';
import { getRotatedPoint } from "util/index"
import * as constant from "store/constant"
import { Point } from "interface/index"
import { getTransformedPointForContainPoint } from "shared/index"

export default class RotationIcon extends Cell {
	public instance: any
	public _size: number = 15

	public _iconImage: HTMLImageElement = new Image()
	get path(): Path2D {
		const path = new Path2D()
		path.rect(
			-this._size / 2,
			-this.length - this._size,
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

	get originX(): number {
		return this.instance.originX
	}

	get originY(): number {
		return this.instance.originY
	}

	constructor( props ) {
		super( props )

		const { instance } = props

		this.instance = instance

		this.type = ROTATE_ICON

		this._iconImage.src = "../../asset/svg/rotate-icon.svg"

		this.isVisiableInMiniMap = false
	}

	public renderByInstance() {
		this.draw.ctx.save()
		transformCenterPointForContext( this.draw, {
			x: this.originX,
			y: this.originY
		}, this )
		this.draw.ctx.rotate( this.instance.angle * constant.DEGREE_TO_RADIAN )
		this.draw.ctx.drawImage(
			this._iconImage,
			-this._size / 2,
			-this.length - this._size,
			this._size,
			this._size
		)
		this.draw.ctx.translate( 0, 0 )
		this.draw.ctx.restore()
	}

	containPoint( x, y ): boolean {
		const transformedPoint: Point = getTransformedPointForContainPoint(
			{ x, y },
			this
		)

		const isContain = this.draw.ctx.isPointInPath(
			this.path,
			transformedPoint.x,
			transformedPoint.y
		)

		return isContain
	}

	// ******* Drag ******
	public handleStartDrag( event ) {
		if ( this.instance.isSelected ) {
			coupleRotatingCell( this.instance, true )
			coupleSelectCell( this.instance, false )
		}
	}
	public _updateDrag( event ) {
		if ( !this.instance.isRotating ) {
			return
		}

		let radianAngle = 0
		let deltaAngle = 0
		const deltaX = event.x - this._prevDraggingPoint.x
		const deltaY = event.y - this._prevDraggingPoint.y

		radianAngle =
			getPointAngleToOrigin( {
				x: event.x - this.draw.canvasLeft - this.originX,
				y: event.y - this.draw.canvasTop - this.originY
			} ) +
			Math.PI / 2

		this._updatePrevDraggingPoint( event )

		this.instance.angle = radianAngle * constant.RADIAN_TO_DEGREE

		this.draw.render()
	}
	public handleStopDrag( event ) {
		if ( this.instance.isRotating ) {
			coupleRotatingCell( this.instance, false )
			coupleSelectCell( this.instance, true )
			this.draw.render()
		}
	}
	// ******* Drag ******
}
