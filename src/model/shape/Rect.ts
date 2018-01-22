import * as _ from "lodash"

import Graph from "model/Graph"
import RotationIcon from "model/tool/RotationIcon"
import * as cellTypeList from "store/constant_cellTypeList"
import * as i from "interface/index"
import SizePoint, {
	SizePointTop,
	SizePointTopLeft,
	SizePointTopRight,
	SizePointLeft,
	SizePointRight,
	SizePointBottom,
	SizePointBottomLeft,
	SizePointBottomRight
} from "model/tool/SizePoint"
import { getRotatedPoint } from "util/index"
import * as constant from "store/constant"
import { getTransformedPointForContainPoint } from "shared/index";

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

	get path(): Path2D {
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
			this._sizePointBottomRight
		]
	}

	constructor( props ) {
		super( props )

		this.type = cellTypeList.RECT
		this.draggable = true

		this._rotationIcon = new RotationIcon( {
			instance: this,
			draw    : this.draw
		} )

		this._initializeSizePoints()
	}

	public _initializeSizePoints() {
		this._sizePointTop = new SizePointTop( {
			instance: this,
			draw    : this.draw
		} )

		this._sizePointTopLeft = new SizePointTopLeft( {
			instance: this,
			draw    : this.draw
		} )

		this._sizePointTopRight = new SizePointTopRight( {
			instance: this,
			draw    : this.draw
		} )

		this._sizePointLeft = new SizePointLeft( {
			instance: this,
			draw    : this.draw
		} )

		this._sizePointRight = new SizePointRight( {
			instance: this,
			draw    : this.draw
		} )

		this._sizePointBottom = new SizePointBottom( {
			instance: this,
			draw    : this.draw
		} )

		this._sizePointBottomLeft = new SizePointBottomLeft( {
			instance: this,
			draw    : this.draw
		} )

		this._sizePointBottomRight = new SizePointBottomRight( {
			instance: this,
			draw    : this.draw
		} )
	}

	public render() {
		const ctx = this.draw.ctx
		super.render()

		ctx.save()
		this.draw.zoomPan.setTransformCenterPoint( {
			x: this.originX,
			y: this.originY
		} )
		ctx.fillStyle = this.fill
		ctx.rotate( this.angle * constant.DEGREE_TO_RADIAN )
		ctx.fill( this.path )

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
		if ( this.isSizing || this.isSelected ) {
			this.sizePoints.map( renderSizePoint )
		}
		function renderSizePoint( sizePoint ) {
			return sizePoint.renderByInstance()
		}
	}

	public containPoint( x, y ): boolean {
		const relativePoint = getTransformedPointForContainPoint( { x, y }, this )

		const isContain = this.draw.ctx.isPointInPath(
			this.path,
			relativePoint.x,
			relativePoint.y
		)
		return isContain
	}

	// ******* Drag ******
	public _updateDrag( event ) {
		const zoom = this.draw.zoomPan.zoom
		this.left =
			this.left + event.x / zoom - this._prevDraggingPoint.x / zoom
		this.top = this.top + event.y / zoom - this._prevDraggingPoint.y / zoom

		this._updatePrevDraggingPoint( event )

		this.draw.render()
	}
	// ******* Drag ******
}
