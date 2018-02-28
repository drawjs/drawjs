import * as _ from "lodash"
import { getRotatedPoint } from "util/index"
import { getTransformedPointForContainPoint } from "shared/index"

enum Direction {
	LEFT = "LEFT",
	RIGHT = "RIGHT",
	TOP = "TOP",
	BOTTOM = "BOTTOM"
}

export default class Size {
	/**
	 * rectangle instance
	 */
	public instance: any

	get instanceWidth(): number {
		return this.instance.width
	}

	get instanceHeight(): number {
		return this.instance.height
	}

	get instanceDiagonal(): number {
		return Math.sqrt(
			Math.pow( this.instanceWidth, 2 ) + Math.pow( this.instanceHeight, 2 )
		)
	}

	get instanceOriginX(): number {
		return this.instance.originX
	}

	get instanceOriginY(): number {
		return this.instance.originY
	}
	get instanceLeftCenterPoint(): Point2D {
		return {
			x: -this.instanceWidth / 2,
			y: 0
		}
	}
	get instanceRightCenterPoint(): Point2D {
		return {
			x: this.instanceWidth / 2,
			y: 0
		}
	}
	get instanceTopCenterPoint(): Point2D {
		return {
			x: 0,
			y: -this.instanceHeight / 2
		}
	}
	get instanceBottomCenterPoint(): Point2D {
		return {
			x: 0,
			y: this.instanceHeight / 2
		}
	}
	get instanceLeftTopPoint(): Point2D {
		return {
			x: -this.instanceWidth / 2,
			y: -this.instanceHeight / 2
		}
	}
	get instanceRightTopPoint(): Point2D {
		return {
			x: this.instanceWidth / 2,
			y: -this.instanceHeight / 2
		}
	}
	get instanceLeftBottomPoint(): Point2D {
		return {
			x: -this.instanceWidth / 2,
			y: this.instanceHeight / 2
		}
	}
	get instanceRightBottomPoint(): Point2D {
		return {
			x: this.instanceWidth / 2,
			y: this.instanceHeight / 2
		}
	}

	constructor( props ) {
		this.instance = props.instance
	}

	public _sizeHorizontalSide( newPoint: Point2D, horizon: Direction ) {
		let transformedNewPoint: Point2D
		let newCenterPoint: Point2D
		let deltaWidth: number
		let deltaX: number
		let deltaY: number

		transformedNewPoint = getTransformedPointForContainPoint(
			newPoint,
			this.instance
		)

		if ( horizon === Direction.LEFT ) {
			deltaWidth = transformedNewPoint.x - this.instanceLeftCenterPoint.x
			deltaY = deltaWidth / 2 * Math.sin( this.instance.radianAngle )
			deltaX = deltaWidth * ( 1 + Math.cos( this.instance.radianAngle ) ) / 2
		}

		if ( horizon === Direction.RIGHT ) {
			deltaWidth = -( transformedNewPoint.x - this.instanceRightTopPoint.x )
			deltaY = -deltaWidth / 2 * Math.sin( this.instance.radianAngle )
			deltaX = deltaWidth * ( 1 - Math.cos( this.instance.radianAngle ) ) / 2
		}

		this.instance.width = this.instance.width - deltaWidth
		this.instance.left = this.instance.left + deltaX
		this.instance.top = this.instance.top + deltaY
	}

	public _sizeVerticalSide( newPoint: Point2D, verticality: Direction ) {
		let transformedNewPoint: Point2D
		let newCenterPoint: Point2D
		let deltaHeight: number
		let deltaX: number
		let deltaY: number

		transformedNewPoint = getTransformedPointForContainPoint(
			newPoint,
			this.instance
		)

		if ( verticality === Direction.TOP ) {
			deltaHeight = transformedNewPoint.y - this.instanceTopCenterPoint.y
			deltaX = deltaHeight / 2 * Math.sin( this.instance.radianAngle )
			deltaY = deltaHeight * ( 1 + Math.cos( this.instance.radianAngle ) ) / 2
		}

		if ( verticality === Direction.BOTTOM ) {
			deltaHeight = -(
				transformedNewPoint.y - this.instanceBottomCenterPoint.y
			)
			deltaX = -( deltaHeight / 2 * Math.sin( this.instance.radianAngle ) )
			deltaY = deltaHeight * ( 1 - Math.cos( this.instance.radianAngle ) ) / 2
		}

		this.instance.height = this.instance.height - deltaHeight
		this.instance.top = this.instance.top + deltaY
		this.instance.left = this.instance.left - deltaX
	}

	/**
	 * Size left side by given new point
	 * ( such as mouse event point dragging )
	 * @param newPoint
	 */
	public sizeLeftSide( newPoint: Point2D ) {
		this._sizeHorizontalSide( newPoint, Direction.LEFT )
	}

	/**
	 * Size right side by given new point
	 * ( such as mouse event point dragging )
	 * @param newPoint
	 */
	public sizeRightSide( newPoint: Point2D ) {
		this._sizeHorizontalSide( newPoint, Direction.RIGHT )
	}

	/**
	 * Size top side by given new point
	 * ( such as mouse event point dragging )
	 * @param newPoint
	 */
	public sizeTopSide( newPoint: Point2D ) {
		this._sizeVerticalSide( newPoint, Direction.TOP )
	}

	/**
	 * Size bottom side by given new point
	 * ( such as mouse event point dragging )
	 * @param newPoint
	 */
	public sizeBottomSide( newPoint: Point2D ) {
		this._sizeVerticalSide( newPoint, Direction.BOTTOM )
	}
}
