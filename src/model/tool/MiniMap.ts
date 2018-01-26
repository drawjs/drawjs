import Draw from "../../Draw"
import {
	coupleUpdateZoomPanZoom,
	coupleUpdateDeltaPointForMiniMap
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
		let zoom: number = this.draw.zoomPan.zoom
		zoom = zoom < 1 ? 1 : zoom

		const path = new Path2D()
		path.rect(
			-this.width / zoom / 2,
			-this.height / zoom / 2,
			this.width / zoom,
			this.height / zoom
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
			minLeft = getCellMin( '__left',  minLeft)
			maxRight = getCellMax( '__right',  maxRight)
			minTop = getCellMin( '__top',  minTop)
			maxBottom = getCellMax( '__bottom',  maxBottom)

			function getCellMin( key, refer ): number {
				return getCellComparedResult( key, refer, isSmailler )
			}
			function getCellMax( key, refer ): number {
				return getCellComparedResult( key, refer, isBigger )
			}

			function getCellComparedResult( key, refer, compare ): number {
				const value = cell[ key ]
				let res = refer
				if ( ! _.isNil( value ) ) {
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
			y: this.draw.canvas.height / 2,
		}
		const res = {
			left: center.x - this.draw.canvas.width / 2 * zoom,
			top: center.x - this.draw.canvas.height / 2 * zoom,
			width: this.draw.canvas.width * zoom,
			height: this.draw.canvas.height * zoom,
		}
		return res
	}

	get canvasScopeZoom(): number {
		let maxZoom: number = 1

		const b = this.elementsBounds
		const center: Point = {
			x: this.draw.canvas.width / 2,
			y: this.draw.canvas.height / 2,
		}

		const leftZoom = Math.abs( ( center.x - b.left ) / center.x )
		const rightZoom = Math.abs( ( b.left + b.width - center.x ) / center.x )
		const topZoom = Math.abs( ( center.y - b.top ) / center.y )
		const bottomZoom = Math.abs( ( b.top + b.height - center.y ) / center.y )

		const max = Math.max( leftZoom, rightZoom, topZoom, bottomZoom )

		maxZoom = max > maxZoom ? max: maxZoom
		return maxZoom
	}

	get transformRate(): number {
		const res = this.sizeRate / this.canvasScopeZoom
		return 0.1
	}


	constructor( props ) {
		this.draw = props.draw

		this.width = this.draw.canvas.width * this.sizeRate
		this.height = this.draw.canvas.height * this.sizeRate
		this.left = 0
		this.top = this.draw.canvas.height - this.height
	}

	transformCenterPointForContext( point: Point ) {
		/**
		 * Transform point from original position to mini map
		 */
		let transformedPoint: Point = {
			x: point.x * this.transformRate,
			y: point.y * this.transformRate + this.top
		}

		log( this.transformRate )

		this.draw.ctx.setTransform(
			this.transformRate,
			0,
			0,
			this.transformRate,
			transformedPoint.x,
			transformedPoint.y
		)
	}

	renderMain() {
		this.isRendering = true

		const self = this

		_renderContainer()
		// _renderviewBox()

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

		function _renderviewBox() {
			const ctx = self.draw.ctx
			ctx.save()

			ctx.translate( self.originX, self.originY )

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
				zoom                    : self.sizeRate,
				strokeStyleForSmallSpace: "rgba( 0, 0, 0, 0.05)",
				strokeStyleForBigSpace  : "rgba( 0, 0, 0, 0.2 )"
			} )
		}
	}

	/**
	 * Render
	 * Caveat: Have to get image data at the begginning of rendering process of draw
	 */
	render() {
		this.draw.ctx.putImageData( this.imageData, this.left, this.top )
	}

	/**
	 * Get mini map's image data at the begginning of rendering process of draw
	 */
	renderMainToGetImageData() {
		this.renderMain()
		this.imageData = this.draw.ctx.getImageData(
			this.left,
			this.top,
			this.width,
			this.height
		)
	}
}
