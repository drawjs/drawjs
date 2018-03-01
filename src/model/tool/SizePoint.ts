import { SIZE_POINT } from "store/constant/cellType"
import Cell from "model/Cell"
import Point from "model/shape/Point"
import * as _ from "lodash"
import { getRotatedPoint, log } from "util/index"
import Size from "mixin/Size"
import { coupleSizingCell, coupleSelectCell, transformCenterPointForContext } from 'mixin/index';
import { getTransformedPointForContainPoint } from "shared/index"

export default abstract class SizePoint extends Point {
	public type: string = SIZE_POINT
	public instance: any
	public Size: Size
	public isHidden: boolean = false

	abstract size( newPoint: Point2D ): void

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

	get originX(): number {
		return this.instanceOriginX + this.x
	}

	get originY(): number {
		return this.instanceOriginY + this.y
	}

	constructor( props ) {
		super( props )

		this.color = "blue"

		this.instance = props.instance

		this.Size = new Size( { instance: this.instance } )

		this.isVisiableInMiniMap = false
	}

	/**
	 * Override
	 */
	public render() {
		const ctx = this.draw.ctx

		ctx.save()

		/**
		 * Keep ratio
		 */
		transformCenterPointForContext(
			this.draw,
			{
				x: this.originX,
				y: this.originY
			},
			this,
			true
		)

		ctx.fillStyle = this.color
		ctx.strokeStyle = this.strokeColor
		ctx.fill( this.path )
		!_.isNil( this.strokeColor ) && ctx.stroke( this.path )
		ctx.restore()
	}

	public setRotatedSizePoint( point: Point2D ) {
		const rotatedSizePoint = getRotatedPoint( point, this.instance.angle )

		this.x = rotatedSizePoint.x
		this.y = rotatedSizePoint.y
	}

	public _hideOtherSizePointsExceptCurrent() {
		const self = this
		this.instance.sizePoints.filter( notCurrent ).map( hide )

		this.draw.render()

		function notCurrent( sizePoint ) {
			const res = sizePoint !== self
			return res
		}
		function hide( sizePoint ) {
			sizePoint.isHidden = true
		}
	}

	public _showAllSizePoints() {
		this.instance.sizePoints.map( show )

		this.draw.render()

		function show( sizePoint ) {
			sizePoint.isHidden = false
		}
	}

	public handleStartDrag( event ) {
		coupleSizingCell( this.instance, true )
		coupleSelectCell( this.instance, false )
	}

	public _updateDrag( event ) {
		if ( !this.instance.isSizing ) {
			return
		}

		this._hideOtherSizePointsExceptCurrent()

		const newPoint: Point2D = {
			x: event.x - this.draw.canvasLeft,
			y: event.y - this.draw.canvasTop
		}

		this.size( newPoint )

		this._updatePrevDraggingPoint( event )
		this.draw.render()
	}

	public handleStopDrag( event ) {
		if ( this.instance.isSizing ) {
			this._showAllSizePoints()

			coupleSizingCell( this.instance, false )
			coupleSelectCell( this.instance, true )

			this.draw.render()
		}
	}

	public contain( x, y ) {
		// const res = isInstancePathContainPointTransformed( x, y, this )

		// const isContain = this.draw.ctx.isPointInPath(
		// 	this.path,
		// 	x,
		// 	y
		// )

		return false
	}
}

export class SizePointLeft extends SizePoint {
	constructor( props ) {
		super( props )
	}

	public renderByInstance() {
		this.setRotatedSizePoint( {
			x: -this.instanceWidth / 2,
			y: 0
		} )
		this.render()
	}

	public size( newPoint ) {
		this.Size.sizeLeftSide( newPoint )
	}
}

export class SizePointRight extends SizePoint {
	constructor( props ) {
		super( props )
	}

	public renderByInstance() {
		this.setRotatedSizePoint( {
			x: this.instanceWidth / 2,
			y: 0
		} )
		this.render()
	}

	public size( newPoint ) {
		this.Size.sizeRightSide( newPoint )
	}
}

export class SizePointTop extends SizePoint {
	constructor( props ) {
		super( props )
	}

	public renderByInstance() {
		this.setRotatedSizePoint( {
			x: 0,
			y: -this.instanceHeight / 2
		} )
		this.render()
	}

	public size( newPoint ) {
		this.Size.sizeTopSide( newPoint )
	}
}

export class SizePointBottom extends SizePoint {
	constructor( props ) {
		super( props )
	}

	public renderByInstance() {
		this.setRotatedSizePoint( {
			x: 0,
			y: this.instanceHeight / 2
		} )
		this.render()
	}

	public size( newPoint ) {
		this.Size.sizeBottomSide( newPoint )
	}
}

export class SizePointTopLeft extends SizePoint {
	constructor( props ) {
		super( props )
	}

	public renderByInstance() {
		this.setRotatedSizePoint( {
			x: -this.instanceWidth / 2,
			y: -this.instanceHeight / 2
		} )

		this.render()
	}

	public size( newPoint ) {
		this.Size.sizeTopSide( newPoint )
		this.Size.sizeLeftSide( newPoint )
	}
}

export class SizePointTopRight extends SizePoint {
	constructor( props ) {
		super( props )
	}

	public renderByInstance() {
		this.setRotatedSizePoint( {
			x: this.instanceWidth / 2,
			y: -this.instanceHeight / 2
		} )
		this.render()
	}

	public size( newPoint ) {
		this.Size.sizeTopSide( newPoint )
		this.Size.sizeRightSide( newPoint )
	}
}

export class SizePointBottomLeft extends SizePoint {
	constructor( props ) {
		super( props )
	}

	public renderByInstance() {
		this.setRotatedSizePoint( {
			x: -this.instanceWidth / 2,
			y: this.instanceHeight / 2
		} )
		this.render()
	}

	public size( newPoint ) {
		this.Size.sizeBottomSide( newPoint )
		this.Size.sizeLeftSide( newPoint )
	}
}

export class SizePointBottomRight extends SizePoint {
	constructor( props ) {
		super( props )
	}

	public renderByInstance() {
		this.setRotatedSizePoint( {
			x: this.instanceWidth / 2,
			y: this.instanceHeight / 2
		} )
		this.render()
	}

	public size( newPoint ) {
		this.Size.sizeBottomSide( newPoint )
		this.Size.sizeRightSide( newPoint )
	}
}

export class SizePointLineSide extends SizePoint {
	public relatedPoint: Point2D

	constructor( props ) {
		super( props )

		this.relatedPoint = props.relatedPoint
	}

	/**
	 * override
	 */
	public _hideOtherSizePointsExceptCurrent() {}

	/**
	 * override
	 */
	public _showAllSizePoints() {}

	public renderByInstance() {
		this.x = this.relatedPoint.x - this.instanceOriginX
		this.y = this.relatedPoint.y - this.instanceOriginY

		this.render()
	}

	public size( newPoint ) {
		const transformedPoint = this.draw.zoomPan.transformPointReversely( newPoint )

		this.relatedPoint.x = transformedPoint.x
		this.relatedPoint.y = transformedPoint.y
	}
}
