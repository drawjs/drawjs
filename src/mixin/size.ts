import * as _ from "lodash"
import * as i from "interface/index"
import { getRotatedPoint } from 'util/index'


enum Direction {
	LEFT = 'LEFT',
	RIGHT = 'RIGHT',
	TOP = 'TOP',
	BOTTOM = 'BOTTOM',
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
			Math.pow( this.instanceWidth, 2 ) +
			Math.pow( this.instanceHeight, 2 )
		)
	}

	get instanceCenterX(): number {
		return this.instance.left + this.instance.width / 2
	}

	get instanceCenterY(): number {
		return this.instance.top + this.instance.height / 2
	}
	get instanceLeftCenterPoint(): i.Point {
		return {
			x: - this.instanceWidth / 2,
			y: 0
		}
	}
	get instanceRightCenterPoint(): i.Point {
		return {
			x: this.instanceWidth / 2,
			y: 0
		}
	}
	get instanceTopCenterPoint(): i.Point {
		return {
			x: 0,
			y: - this.instanceHeight / 2
		}
	}
	get instanceBottomCenterPoint(): i.Point {
		return {
			x: 0,
			y: this.instanceHeight / 2
		}
	}
	get instanceLeftTopPoint(): i.Point {
		return {
			x: - this.instanceWidth / 2,
			y: - this.instanceHeight / 2
		}
	}
	get instanceRightTopPoint(): i.Point {
		return {
			x: this.instanceWidth / 2,
			y: - this.instanceHeight / 2
		}
	}
	get instanceLeftBottomPoint(): i.Point {
		return {
			x: - this.instanceWidth / 2,
			y: this.instanceHeight / 2
		}
	}
	get instanceRightBottomPoint(): i.Point {
		return {
			x: this.instanceWidth / 2,
			y: this.instanceHeight / 2
		}
	}

	constructor( props ) {
		this.instance = props.instance
	}

	public _getTransformedPointForSize( point: i.Point, centerPoint?: i.Point ) {
		let res: i.Point = {
			x: point.x - this.instanceCenterX,
			y: point.y - this.instanceCenterY
		}

		res = getRotatedPoint( res, -this.instance.angle, centerPoint )

		return res
	}

	public _sizeHorizontalSide( newPoint: i.Point, horizon: Direction ) {
		let transformedNewPoint: i.Point
		let newCenterPoint: i.Point
		let deltaWidth: number
		let deltaX: number
		let deltaY: number

		transformedNewPoint = this._getTransformedPointForSize( newPoint )

		if ( horizon === Direction.LEFT ) {
			deltaWidth = transformedNewPoint.x - this.instanceLeftCenterPoint.x
			deltaY = deltaWidth / 2 * Math.sin( this.instance.radianAngle )
			deltaX = deltaWidth * ( 1 + Math.cos( this.instance.radianAngle ) ) / 2
		}

		if ( horizon === Direction.RIGHT ) {
			deltaWidth = - ( transformedNewPoint.x - this.instanceRightTopPoint.x )
			deltaY = - deltaWidth / 2 * Math.sin( this.instance.radianAngle )
			deltaX = deltaWidth * ( 1 - Math.cos( this.instance.radianAngle ) ) / 2
		}

		this.instance.width = this.instance.width - deltaWidth
		this.instance.left = this.instance.left + deltaX
		this.instance.top = this.instance.top + deltaY
	}

	public _sizeVerticalSide( newPoint: i.Point, verticality: Direction ) {
		let transformedNewPoint: i.Point
		let newCenterPoint: i.Point
		let deltaHeight: number
		let deltaX: number
		let deltaY: number

		transformedNewPoint = this._getTransformedPointForSize( newPoint )

		if ( verticality === Direction.TOP ) {
			deltaHeight = transformedNewPoint.y - this.instanceTopCenterPoint.y
			deltaX = deltaHeight / 2 * Math.sin( this.instance.radianAngle )
			deltaY = deltaHeight * ( 1 + Math.cos( this.instance.radianAngle ) ) / 2
		}

		if ( verticality === Direction.BOTTOM ) {
			deltaHeight = - ( transformedNewPoint.y - this.instanceBottomCenterPoint.y )
			deltaX = - ( deltaHeight / 2 * Math.sin( this.instance.radianAngle ) )
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
	public sizeLeftSide( newPoint: i.Point ) {
		this._sizeHorizontalSide( newPoint, Direction.LEFT )
	}

	/**
	 * Size right side by given new point
	 * ( such as mouse event point dragging )
	 * @param newPoint
	 */
	public sizeRightSide( newPoint: i.Point ) {
		this._sizeHorizontalSide( newPoint, Direction.RIGHT )
	}

	/**
	 * Size top side by given new point
	 * ( such as mouse event point dragging )
	 * @param newPoint
	 */
	public sizeTopSide( newPoint: i.Point ) {
		this._sizeVerticalSide( newPoint, Direction.TOP )
	}

	/**
	 * Size bottom side by given new point
	 * ( such as mouse event point dragging )
	 * @param newPoint
	 */
	public sizeBottomSide( newPoint: i.Point ) {
		this._sizeVerticalSide( newPoint, Direction.BOTTOM )
	}
}



