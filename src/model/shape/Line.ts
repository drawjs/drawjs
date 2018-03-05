import * as _ from "lodash"

import Graph from "model/Graph"
import * as cellTypeList from "store/constant/cellType"
import { DEFAULT_PATH_EXPANDING_VALUE } from "store/constant/index"
import SizePoint, { SizePointLineSide } from "model/tool/SizePoint"
import { getTransformedPointForContainPoint, isInstancePathContainPointTransformed } from "shared/index"
import getters from "../../store/draw/getters";

export default class Line extends Graph {
	public pointStart: Point2D
	public pointEnd: Point2D
	public lineWidth: number

	public _sizePointA: SizePointLineSide
	public _sizePointB: SizePointLineSide

	set left( value ) {}
	set top( value ) {}
	set width( value ) {}
	set height( value ) {}
	get left(): number {
		return this.pointLeft.x
	}
	get top(): number {
		return Math.min( this.pointStart.y, this.pointEnd.y )
	}
	get width(): number {
		return this.length * Math.cos( this.relativeAngle )
	}
	get height(): number {
		return this.length * Math.sin( this.relativeAngle )
	}
	get originX(): number {
		return this.left + this.width / 2
	}

	get originY(): number {
		return this.top + this.height / 2
	}

	get relativeAngle(): number {
		const deltaX = Math.abs( this.pointEnd.x - this.pointStart.x )
		const deltaY = Math.abs( this.pointEnd.y - this.pointStart.y )

		const isXZero = deltaX === 0
		const relativeAngle = isXZero ?
			Math.PI / 2 :
			Math.atan( Math.abs( deltaY / deltaX ) )
		return relativeAngle
	}
	get length(): number {
		const length = Math.sqrt(
			Math.pow( this.pointEnd.x - this.pointStart.x, 2 ) +
				Math.pow( this.pointEnd.y - this.pointStart.y, 2 )
		)
		return length
	}
	get isXEndBiggerThantStart(): boolean {
		return this.pointEnd.x - this.pointStart.x > 0
	}
	get isYRightSmallerThanLeft(): boolean {
		return this.pointRight.y < this.pointLeft.y
	}
	get pointLeft(): Point2D {
		return this.isXEndBiggerThantStart ? this.pointStart : this.pointEnd
	}
	get pointRight(): Point2D {
		return this.isXEndBiggerThantStart ? this.pointEnd : this.pointStart
	}
	get sizePoints(): SizePointLineSide[] {
		return [ this._sizePointA, this._sizePointB ]
	}
	get path(): Path2D {
		const path = new Path2D()

		path.moveTo(
			this.pointStart.x - this.originX,
			this.pointStart.y - this.originY
		)
		path.lineTo(
			this.pointEnd.x - this.originX,
			this.pointEnd.y - this.originY
		)

		return path
	}
	get pathStoked(): Path2D {
		const self = this
		const path = new Path2D()
		const w = DEFAULT_PATH_EXPANDING_VALUE
		const l = this.length
		const alpha = this.relativeAngle
		const isAlphaBiggerThanPIDivide4 = alpha > Math.PI / 4
		const SQURT2W = Math.sqrt( 2 ) * w

		let point1: Point2D
		let point2: Point2D
		let point3: Point2D
		let point4: Point2D

		if ( this.isYRightSmallerThanLeft ) {
			/**
			 * top left
			 */
			point1 = {
				x: this.pointLeft.x + w * ( -Math.sin( alpha ) - Math.cos( alpha ) ),
				y: this.pointLeft.y + w * ( -Math.cos( alpha ) + Math.sin( alpha ) )
			}

			/**
			 * top right
			 */
			point2 = {
				x: this.pointRight.x + w * ( -Math.sin( alpha ) + Math.cos( alpha ) ),
				y: this.pointRight.y + w * ( -Math.cos( alpha ) - Math.sin( alpha ) )
			}

			/**
			 * bottom right
			 */
			point3 = {
				x: this.pointRight.x + w * ( Math.sin( alpha ) + Math.cos( alpha ) ),
				y: this.pointRight.y + w * ( Math.cos( alpha ) - Math.sin( alpha ) )
			}

			/**
			 * bottom left
			 */
			point4 = {
				x: this.pointLeft.x + w * ( Math.sin( alpha ) - Math.cos( alpha ) ),
				y: this.pointLeft.y + w * ( Math.cos( alpha ) + Math.sin( alpha ) )
			}
		}

		if ( !this.isYRightSmallerThanLeft ) {
			/**
			 * top left
			 */
			point1 = {
				x: this.pointLeft.x + w * ( Math.sin( alpha ) - Math.cos( alpha ) ),
				y: this.pointLeft.y + w * ( -Math.cos( alpha ) - Math.sin( alpha ) )
			}

			/**
			 * top right
			 */
			point2 = {
				x: this.pointRight.x + w * ( Math.sin( alpha ) + Math.cos( alpha ) ),
				y: this.pointRight.y + w * ( -Math.cos( alpha ) + Math.sin( alpha ) )
			}

			/**
			 * bottom right
			 */
			point3 = {
				x: this.pointRight.x + w * ( -Math.sin( alpha ) + Math.cos( alpha ) ),
				y: this.pointRight.y + w * ( Math.cos( alpha ) + Math.sin( alpha ) )
			}

			/**
			 * bottom left
			 */
			point4 = {
				x: this.pointLeft.x + w * ( -Math.sin( alpha ) - Math.cos( alpha ) ),
				y: this.pointLeft.y + w * ( Math.cos( alpha ) - Math.sin( alpha ) )
			}
		}

		if ( !this.isYRightSmallerThanLeft ) {
		}

		let points = [ point1, point2, point3, point4, point1 ]

		points = points.map( updatePosition )

		points.map( connectLine( path ) )

		return path

		function updatePosition( point: Point2D ) {
			return {
				x: point.x - self.originX,
				y: point.y - self.originY
			}
		}

		function connectLine( path: Path2D ) {
			return ( point: Point2D, pointIndex ) => {
				pointIndex === 0 && path.moveTo( point.x, point.y )
				pointIndex !== 0 && path.lineTo( point.x, point.y )
			}
		}
	}

	constructor( props ) {
		super( props )

		const { pointStart, pointEnd } = props

		this.type = cellTypeList.LINE
		this.pointStart = pointStart
		this.pointEnd = pointEnd

		this._sizePointA = new SizePointLineSide( {
			instance    : this,
			draw        : this.draw,
			relatedPoint: pointStart
		} )

		this._sizePointB = new SizePointLineSide( {
			instance    : this,
			draw        : this.draw,
			relatedPoint: pointEnd
		} )
	}

	public render() {
		const ctx = getters.ctx
		super.render()

		ctx.save()
		ctx.lineWidth = 1
		ctx.strokeStyle = this.fill
		ctx.stroke( this.path )

		ctx.fillStyle = "rgba(43, 228, 430, 0.3)"
		ctx.fill( this.pathStoked )

		ctx.restore()

		/**
		 * render size points
		 */
		if ( this.isSizing || this.shouldSelect ) {
			this.sizePoints.map( renderSizePoint )
		}
		function renderSizePoint( sizePoint ) {
			return sizePoint.renderByInstance()
		}
	}

	public contain( x: number, y: number ) {
		const res = isInstancePathContainPointTransformed( x, y, this, this.pathStoked )
		return res
	}

	// ******* Drag ******
	public updateDrag( event ) {
		// const zoom = this.draw.zoomPan.zoom
		// this.pointStart.x =
		// 	this.pointStart.x + ( event.x - this.dragger.prevPoint.x ) / zoom
		// this.pointStart.y =
		// 	this.pointStart.y + ( event.y - this.dragger.prevPoint.y ) / zoom

		// this.pointEnd.x = this.pointEnd.x + ( event.x - this.dragger.prevPoint.x ) / zoom
		// this.pointEnd.y = this.pointEnd.y + ( event.y - this.dragger.prevPoint.y ) / zoom

		// this.draw.render()
	}
	// ******* Drag ******
}
