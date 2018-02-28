import * as _ from "lodash"

import Geometry from "model/Geometry"
import Cell from "model/Cell"
import { ROTATE_ICON } from "store/constant_cellTypeList"
import { getPointAngleToOrigin, log } from "util/index"
import {
	coupleRotatingCell,
	coupleSelectCell,
	transformCenterPointForContext
} from "mixin/index"
import { getRotatedPoint } from "util/index"
import * as constant from "store/constant"
import { getTransformedPointForContainPoint } from "shared/index"

export default class RotationIcon extends Cell {
	public type = ROTATE_ICON
	public instance: any
	public _size: number = 15

	/**
	 * Space between icon and instance's top border
	 */
	public _deltaSpace: number = 20

	public _iconImage: HTMLImageElement = new Image()

	get path(): Path2D {
		const path = new Path2D()

		path.rect( -this._size / 2, -this.basicDistance, this._size, this._size )
		return path
	}

	/**
	 * Distance between instance's center point and the center point of this
	 */
	get zoomedDistance(): number {
		const res =
			this.instance.height / 2 * this.draw.zoomPan.zoom +
			this._deltaSpace +
			this._size / 2
		return res
	}

	/**
	 * Basic distance between instance's center point and the center point of this when zoom ratio equals 1
	 */
	get basicDistance(): number {
		const res = this.instance.height / 2 + this._deltaSpace + this._size / 2
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

		this._iconImage.src = "../../asset/svg/rotate-icon.svg"

		this.isVisiableInMiniMap = false
	}

	public renderByInstance() {
		const self = this
		const ctx = this.draw.ctx
		ctx.save()

		transformCenterPointForContext(
			this.draw,
			{
				x: this.originX,
				y: this.originY
			},
			this,
			true
		)
		ctx.rotate( this.instance.angle * constant.DEGREE_TO_RADIAN )

		ctx.drawImage(
			this._iconImage,
			-this._size / 2,
			-this.zoomedDistance,
			this._size,
			this._size
		)
		ctx.translate( 0, 0 )
		ctx.restore()
	}

	containPoint( x, y ): boolean {
		const self = this
		const transformedReverselyPoint: Point2D = getTransformedPointForContainPoint(
			{
				x,
				y,
			},
			this
		)



		const deltaY = getDeltaY()

		const isContain = this.draw.ctx.isPointInPath( this.path, transformedReverselyPoint.x, transformedReverselyPoint.y - deltaY )

		return isContain

		function getDeltaY(): number {
			let res: number = 0
			const transformedCenterPoint = self.draw.zoomPan.transformPoint( {
				x: self.originX,
				y: self.originY
			} )

			const transformedReverselyPoint: Point2D = getTransformedPointForContainPoint(
				{
					x: transformedCenterPoint.x,
					y: transformedCenterPoint.y - self.zoomedDistance
				},
				self
			)
			res = self.basicDistance - Math.abs( transformedReverselyPoint.y )
			return res
		}
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

		const { zoom, panPoint } = this.draw.zoomPan

		radianAngle =
			getPointAngleToOrigin( {
				x:
					event.x -
					this.draw.canvasLeft -
					this.originX -
					panPoint.x * zoom,
				y:
					event.y -
					this.draw.canvasTop -
					this.originY -
					panPoint.y * zoom
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
