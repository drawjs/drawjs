import * as _ from "lodash"

import Graph from "model/Graph"
import RotationIcon from '../tool/RotationIcon'
import * as cellTypeList from "store/constant_cellTypeList"
import * as i from "interface/index"
import SizePoint, { SizePointTop, SizePointTopLeft, SizePointTopRight, SizePointLeft, SizePointRight, SizePointBottom, SizePointBottomLeft, SizePointBottomRight } from "../tool/SizePoint";
import { getRotatedPoint } from 'util/index'

export default class Rect extends Graph {
	public _rotationIcon: RotationIcon

	public _sizePointTop: SizePointTop
	public _sizePointTopLeft: SizePointTopLeft
	public _sizePointTopRight: SizePointTopRight
	public _sizePointLeft: SizePointLeft
	public _sizePointRight: SizePointRight
	public _sizePointBottom: SizePointBottom
	public _sizePointBottomLeft: SizePointBottomLeft
	public _sizePointBottomRight: SizePointBottomRight

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

	get sizePoints(): any[] {
		return [
			this._sizePointTop,
			this._sizePointTopLeft,
			this._sizePointTopRight,
			this._sizePointLeft,
			this._sizePointRight,
			this._sizePointBottomLeft,
			this._sizePointBottom,
			this._sizePointBottomRight,
		]
	}

	constructor( props ) {
		super( props )

		this.type = cellTypeList.RECT
		this.draggable = true


		this._rotationIcon = new RotationIcon( {
			instance: this,
			draw: this.draw
		} )

		this._initializeSizePoints()
	}

	public _initializeSizePoints() {
		this._sizePointTop = new SizePointTop( {
			instance: this,
			draw: this.draw,
		} )

		this._sizePointTopLeft = new SizePointTopLeft( {
			instance: this,
			draw: this.draw,
		} )

		this._sizePointTopRight = new SizePointTopRight( {
			instance: this,
			draw: this.draw,
		} )

		this._sizePointLeft = new SizePointLeft( {
			instance: this,
			draw: this.draw,
		} )

		this._sizePointRight = new SizePointRight( {
			instance: this,
			draw: this.draw,
		} )

		this._sizePointBottom = new SizePointBottom( {
			instance: this,
			draw: this.draw,
		} )

		this._sizePointBottomLeft = new SizePointBottomLeft( {
			instance: this,
			draw: this.draw,
		} )

		this._sizePointBottomRight = new SizePointBottomRight( {
			instance: this,
			draw: this.draw,
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

		/**
		 * render rotation icon
		 */
		if ( this.isRotating || this.isSelected ) {
			this._rotationIcon.renderByInstance()
		}

		/**
		 * render size points
		 */
		this.sizePoints.map( renderSizePoint )
		function renderSizePoint( sizePoint ) {
			return sizePoint.renderByInstance()
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

		resPoint = getRotatedPoint( resPoint, -this.angle )

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
