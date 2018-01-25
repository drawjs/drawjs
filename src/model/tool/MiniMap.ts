import Draw from "../../Draw"
import { coupleUpdateZoomPanZoom, coupleUpdateDeltaPointForMiniMap } from "mixin/index"
import { renderElement } from "shared/index"
import { Point } from 'interface/index'
import * as _ from "lodash"
import { renderGrid, log } from 'util/index';


export default class MiniMap {
	public draw: Draw
	public width: number
	public height: number
	public left: number
	public top: number
	public sizeRate: number = 0.3
	public isRendering: boolean = false

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
	get zoomBoxPath(): Path2D {
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

	constructor( props ) {
		this.draw = props.draw

		this.width = this.draw.canvas.width * this.sizeRate
		this.height = this.draw.canvas.height * this.sizeRate
		this.left = 0
		this.top = this.draw.canvas.height - this.height
	}

	transformCenterPointForContext( point: Point ) {
		let transformedPoint: Point = this.draw.zoomPan.transformPoint( point )

		transformedPoint = {
			x: transformedPoint.x,
			y: transformedPoint.y
		}

		this.draw.ctx.setTransform(
			this.draw.zoomPan.zoom * this.sizeRate,
			0,
			0,
			this.draw.zoomPan.zoom * this.sizeRate,
			transformedPoint.x,
			transformedPoint.y
		)
	}

	render() {
		this.isRendering = true

		const self = this

		log( 'render' )

		_renderContainer()
		// _renderZoomBox()

		// _renderGrid()
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

		function _renderZoomBox() {
			const ctx = self.draw.ctx
			ctx.save()

			ctx.translate( self.originX, self.originY )

			ctx.lineWidth = 1
			ctx.strokeStyle = "red"
			ctx.stroke( self.zoomBoxPath )

			ctx.restore()
		}

		function _renderCanvasMain() {
			/**
			 * Cache zoom, deltaPointForTransformedCenterPointForContext in zoomPan for recovering it later
			 */
			// const cachedZoom: number = self.draw.zoomPan.zoom
			// const cachedDeltaPointForTransformedCenterPointForContext: Point = _.cloneDeep( self.draw.zoomPan.deltaPointForMiniMap )

			// /**
			//  * Update zoom, deltaPointForTransformedCenterPointForContext of zoomPan
			//  */
			// coupleUpdateZoomPanZoom( self.draw.zoomPan, self.sizeRate )
			// coupleUpdateDeltaPointForMiniMap( self.draw.zoomPan, {
			// 	x: self.left,
			// 	y: self.top,
			// } )
			/**
			 * Render cells, grids again in mini map
			 */
			self.draw.cellList.map( renderElement )

			/**
			 * Recover zoom, deltaPointForTransformedCenterPointForContext of zoomPan
			 */
			// coupleUpdateZoomPanZoom( self.draw.zoomPan, cachedZoom )
			// coupleUpdateDeltaPointForMiniMap( self.draw.zoomPan, cachedDeltaPointForTransformedCenterPointForContext )
		}

		function _renderGrid() {
			const origin: Point = {
				x: 0,
				y: self.top
			}
			renderGrid( self.draw, self.width, self.height, origin, self.sizeRate )
		}
	}

}
