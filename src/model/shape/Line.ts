import * as _ from "lodash"

import Graph from "model/Graph"
import * as cellTypeList from "store/constant_cellTypeList"
import * as i from "interface/index"
import { defaultPathExandingValue } from "store/index"

export default class Line extends Graph {
	public pointStart: i.Point
	public pointEnd: i.Point
	public lineWidth: number

	set left( value ) {}
	set top( value ) {}
	set width( value ) {}
	set height( value ) {}
	get left(): number {
		return this.pointLeft.x
	}
	get top(): number {
		return Math.min(
			this.pointStart.y,
			this.pointEnd.y,
		)
	}
	get width(): number {
		return this.length * Math.cos( this.relativeAngle )
	}
	get height(): number {
		return this.length * Math.sin( this.relativeAngle )
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
	get pointLeft(): i.Point {
		return this.isXEndBiggerThantStart ? this.pointStart : this.pointEnd
	}
	get pointRight(): i.Point {
		return this.isXEndBiggerThantStart ? this.pointEnd : this.pointStart
	}
	get renderPath(): Path2D {
		const path = new Path2D()

		path.moveTo( this.pointStart.x, this.pointStart.y )
		path.lineTo( this.pointEnd.x, this.pointEnd.y )

		return path
	}
	get pathStoke(): Path2D {
		const path = new Path2D()
		const w = defaultPathExandingValue
		const l = this.length
		const alpha = this.relativeAngle
		const isAlphaBiggerThanPIDivide4 = alpha > Math.PI / 4
		const SQURT2W = Math.sqrt( 2 ) * w

		let point1: i.Point
		let point2: i.Point
		let point3: i.Point
		let point4: i.Point

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

		const points = [ point1, point2, point3, point4, point1 ]

		points.map( connectLine( path ) )

		return path
	}

	constructor( {
		pointStart,
		pointEnd,
		fill = "black",
		lineWidth = 1,
		draggable = true,
		isSelected = false
	}: {
		pointStart: i.Point
		pointEnd: i.Point
		fill?: string
		lineWidth?: number
		draggable: boolean
		isSelected: boolean
	} ) {
		super( {
			fill,
			draggable,
			isSelected
		} )

		this.type = cellTypeList.LINE
		this.pointStart = pointStart
		this.pointEnd = pointEnd
	}

	public render( ctx: CanvasRenderingContext2D ) {
		super.render( ctx )

		ctx.save()
		// ctx.rotate((Math.PI / 180) * this.relativeAngle)
		ctx.lineWidth = 1
		ctx.strokeStyle = this.fill
		ctx.stroke( this.renderPath )

		ctx.fillStyle = "rgba(43, 228, 430, 0.3)"
		ctx.fill( this.pathStoke )
		// ctx.strokeStyle = "rgba(43, 228, 430, 0.3)"
		// ctx.stroke( this.pathStoke )

		ctx.restore()
	}

	public containPoint( x: number, y: number ) {
		const isContain = this.draw.ctx.isPointInPath( this.pathStoke, x, y )
		return isContain
	}


	// ******* Drag ******
	public _updateDrag( event ) {
		this.pointStart.x = this.pointStart.x + event.x - this._prevDraggingPoint.x
		this.pointStart.y = this.pointStart.y + event.y - this._prevDraggingPoint.y

		this.pointEnd.x = this.pointEnd.x + event.x - this._prevDraggingPoint.x
		this.pointEnd.y = this.pointEnd.y + event.y - this._prevDraggingPoint.y

		this._updatePrevDraggingPoint( event )
	}
	// ******* Drag ******
}

function connectLine( path: Path2D ) {
	return ( point: i.Point, pointIndex ) => {
		pointIndex === 0 && path.moveTo( point.x, point.y )
		pointIndex !== 0 && path.lineTo( point.x, point.y )
	}
}
