import * as _ from "lodash"

import Graph from "model/Graph"
import RotationIcon from '../tool/RotationIcon'
import * as cellTypeList from "store/constant_cellTypeList"
import * as i from "interface/index"
import ScalePoint, { ScalePointTop, ScalePointTopLeft, ScalePointTopRight, ScalePointLeft, ScalePointRight, ScalePointBottom, ScalePointBottomLeft, ScalePointBottomRight } from "../tool/ScalePoint";
import { getRotatedPoint } from 'util/index'

export default class Rect extends Graph {
	public _rotationIcon: RotationIcon

	public _scalePointTop: ScalePointTop
	public _scalePointTopLeft: ScalePointTopLeft
	public _scalePointTopRight: ScalePointTopRight
	public _scalePointLeft: ScalePointLeft
	public _scalePointRight: ScalePointRight
	public _scalePointBottom: ScalePointBottom
	public _scalePointBottomLeft: ScalePointBottomLeft
	public _scalePointBottomRight: ScalePointBottomRight

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

	get scalePoints(): any[] {
		return [
			this._scalePointTop,
			this._scalePointTopLeft,
			this._scalePointTopRight,
			this._scalePointLeft,
			this._scalePointRight,
			this._scalePointBottomLeft,
			this._scalePointBottom,
			this._scalePointBottomRight,
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

		this._initializeScalePoints()
	}

	public _initializeScalePoints() {
		this._scalePointTop = new ScalePointTop( {
			instance: this,
			draw: this.draw,
		} )

		this._scalePointTopLeft = new ScalePointTopLeft( {
			instance: this,
			draw: this.draw,
		} )

		this._scalePointTopRight = new ScalePointTopRight( {
			instance: this,
			draw: this.draw,
		} )

		this._scalePointLeft = new ScalePointLeft( {
			instance: this,
			draw: this.draw,
		} )

		this._scalePointRight = new ScalePointRight( {
			instance: this,
			draw: this.draw,
		} )

		this._scalePointBottom = new ScalePointBottom( {
			instance: this,
			draw: this.draw,
		} )

		this._scalePointBottomLeft = new ScalePointBottomLeft( {
			instance: this,
			draw: this.draw,
		} )

		this._scalePointBottomRight = new ScalePointBottomRight( {
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
		 * render scale points
		 */
		this.scalePoints.map( renderScalePoint )
		function renderScalePoint( scalePoint ) {
			return scalePoint.renderByInstance()
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
