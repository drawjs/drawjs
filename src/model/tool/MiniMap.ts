import Draw from "../../Draw"
import {
	coupleUpdateZoomPanZoom,
} from "mixin/index"
import { renderElement, renderGridMiniMap } from "shared/index"
import { Point, Rect } from "interface/index"
import * as _ from "lodash"
import { log } from "util/index"

export default class MiniMap {
	public draw: Draw
	public width: number
	public height: number
	public left: number
	public top: number
	public sizeRate: number = 0.3
	public isRendering: boolean = false
	public imageData: any = null

	get originX(): number {
		return this.left + this.width / 2
	}

	get originY(): number {
		return this.top + this.height / 2
	}

	get path(): Path2D {
		const path = new Path2D()
		path.rect( -this.width / 2, -this.height / 2, this.width, this.height )
		return path
	}

	get viewBoxPath(): Path2D {
		const path = new Path2D()
		path.rect(
			-this.width / 2,
			-this.height / 2,
			this.width,
			this.height
		)
		return path
	}

	get miniZoom(): number {
		const res = this.draw.zoomPan.zoom * 0.3
		return res
	}

	get elementsBounds(): Rect {
		let minLeft: number = 0
		let maxRight: number = 0
		let minTop: number = 0
		let maxBottom: number = 0
		let res: Rect

		this.draw.cellList.map( get )

		function get( cell ) {
			minLeft = getCellMin( "__left", minLeft )
			maxRight = getCellMax( "__right", maxRight )
			minTop = getCellMin( "__top", minTop )
			maxBottom = getCellMax( "__bottom", maxBottom )

			function getCellMin( key, refer ): number {
				return getCellComparedResult( key, refer, isSmailler )
			}
			function getCellMax( key, refer ): number {
				return getCellComparedResult( key, refer, isBigger )
			}

			function getCellComparedResult( key, refer, compare ): number {
				const value = cell[ key ]
				let res = refer
				if ( !_.isNil( value ) ) {
					if ( compare( value, refer ) ) {
						res = value
					}
				}
				return res
			}

			function isBigger( a, b ) {
				return a > b
			}
			function isSmailler( a, b ) {
				return a < b
			}
		}

		res = {
			left  : minLeft,
			top   : minTop,
			width : maxRight - minLeft,
			height: maxBottom - minTop
		}
		return res
	}

	get scopeRect(): Rect {
		const zoom = this.canvasScopeZoom
		const center: Point = {
			x: this.draw.canvas.width / 2,
			y: this.draw.canvas.height / 2
		}
		const res = {
			left  : center.x - this.draw.canvas.width / 2 * zoom,
			top   : center.x - this.draw.canvas.height / 2 * zoom,
			width : this.draw.canvas.width * zoom,
			height: this.draw.canvas.height * zoom
		}
		return res
	}

	get canvasScopeZoom(): number {
		let maxZoom: number = 1

		const b = this.elementsBounds
		const center: Point = {
			x: this.draw.canvas.width / 2,
			y: this.draw.canvas.height / 2
		}

		const leftZoom = Math.abs( ( center.x - b.left ) / center.x )
		const rightZoom = Math.abs( ( b.left + b.width - center.x ) / center.x )
		const topZoom = Math.abs( ( center.y - b.top ) / center.y )
		const bottomZoom = Math.abs( ( b.top + b.height - center.y ) / center.y )

		const max = Math.max( leftZoom, rightZoom, topZoom, bottomZoom )

		maxZoom = max > maxZoom ? max : maxZoom
		return maxZoom
	}

	get transformRate(): number {
		const res = this.sizeRate / this.canvasScopeZoom
		return res
	}

	get deltaXForAutoZoom(): number {
		const res =
			( this.sizeRate * this.draw.canvas.width -
				this.transformRate * this.draw.canvas.width ) /
			2
		return res
	}

	get deltaYForAutoZoom(): number {
		const res =
			( this.sizeRate * this.draw.canvas.height -
				this.transformRate * this.draw.canvas.height ) /
			2
		return res
	}

	constructor( props ) {
		this.draw = props.draw

		this.width = this.draw.canvas.width * this.sizeRate
		this.height = this.draw.canvas.height * this.sizeRate
		this.left = 0
		this.top = this.draw.canvas.height - this.height
	}

	public transformCenterPointForContext( point: Point ) {
		/**
		 * Transform point from original position to mini map
		 */
		let transformedPoint: Point = {
			x: point.x * this.transformRate + this.deltaXForAutoZoom,
			y: point.y * this.transformRate + this.top + this.deltaYForAutoZoom
		}

		this.draw.ctx.setTransform(
			this.transformRate,
			0,
			0,
			this.transformRate,
			transformedPoint.x,
			transformedPoint.y
		)
	}

	public transformViewBoxCenterPoint( point: Point ) {
		const staticBasicOriginalCanvasCenterPoint = this.draw.canvasCenterPoint
		const currentOriginalCanvasCenterPoint = this.draw.zoomPan.transformPointReversely( this.draw.canvasCenterPoint )

		const deltaX = currentOriginalCanvasCenterPoint.x - staticBasicOriginalCanvasCenterPoint.x
		const deltaY = currentOriginalCanvasCenterPoint.y - staticBasicOriginalCanvasCenterPoint.y

		// log( deltaX )
		// log( this.canvasScopeZoom )

		const res = {
			x: point.x + deltaX * this.transformRate,
			y: point.y + deltaY * this.transformRate
		}
		return res
	}

	public renderMain() {
		this.isRendering = true

		const self = this

		_renderContainer()
		_renderViewBox()

		_renderGrid()
		_renderCanvasMain()

		this.isRendering = false
		function _renderContainer() {
			const ctx = self.draw.ctx
			ctx.save()

			ctx.translate( self.originX, self.originY )

			ctx.fillStyle = "white"
			ctx.fill( self.path )
			ctx.lineWidth = 1
			ctx.strokeStyle = "#666"
			ctx.stroke( self.path )

			ctx.restore()
		}

		function _renderViewBox() {
			const ctx = self.draw.ctx
			let zoom: number = self.draw.zoomPan.zoom * self.canvasScopeZoom

			ctx.save()

			const transformedPoint = self.transformViewBoxCenterPoint( {
				x: self.originX,
				y: self.originY
			} )

			ctx.setTransform(
				1 / zoom,
				0,
				0,
				1 / zoom,
				transformedPoint.x,
				transformedPoint.y
			)


			ctx.lineWidth = 1
			ctx.strokeStyle = "red"
			ctx.stroke( self.viewBoxPath )

			ctx.restore()
		}

		function _renderCanvasMain() {
			self.draw.cellList.map( renderElement )
		}

		function _renderGrid() {
			const origin: Point = {
				x: 0,
				y: self.top
			}
			renderGridMiniMap( {
				canvas                  : self.draw.canvas,
				width                   : self.width,
				height                  : self.height,
				origin,
				zoom                    : self.transformRate,
				deltaXForZoom           : self.deltaXForAutoZoom,
				deltaYForZoom           : self.deltaYForAutoZoom,
				strokeStyleForSmallSpace: "rgba( 0, 0, 0, 0.05)",
				strokeStyleForBigSpace  : "rgba( 0, 0, 0, 0.2 )"
			} )
		}
	}

	/**
	 * Render
	 * Caveat: Have to get image data at the begginning of rendering process of draw
	 */
	public render() {
		this.draw.ctx.putImageData( this.imageData, this.left, this.top )
	}

	/**
	 * Get mini map's image data at the begginning of rendering process of draw
	 */
	public renderMainToGetImageData() {
		this.renderMain()
		this.imageData = this.draw.ctx.getImageData(
			this.left,
			this.top,
			this.width,
			this.height
		)
	}
}
