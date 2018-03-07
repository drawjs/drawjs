// import Draw from "../../Draw"
// import {
// 	renderElement,
// 	renderGridMiniMap,
// 	getTransformedPointForContainPoint,
// 	isInstancePathContainPointTransformed
// } from "shared/index"
// import * as _ from "lodash"
// import { log, isNotNil } from "util/index"
// import Cell from "model/Cell"
// import { MINI_MAP, MINI_MAP_VIEW_BOX } from "store/constant/cellType"
// import excludingTypesForMiniMapElementsBounds from "store/exclude/excludingTypesForMiniMapElementsBounds"

// export default class MiniMap extends Cell {
// 	public draw: Draw
// 	type: string = MINI_MAP

// 	public viewBox: ViewBox

// 	public width: number
// 	public height: number
// 	public left: number
// 	public top: number
// 	public sizeRate: number = 0.3
// 	public isRendering: boolean = false
// 	public imageData: any = null

// 	get originX(): number {
// 		return this.left + this.width / 2
// 	}

// 	get originY(): number {
// 		return this.top + this.height / 2
// 	}

// 	get path(): Path2D {
// 		const path = new Path2D()
// 		path.rect( -this.width / 2, -this.height / 2, this.width, this.height )
// 		return path
// 	}

// 	get miniZoom(): number {
// 		// const res = this.draw.zoomPan.zoom * 0.3
// 		// return res
// 		return
// 	}

// 	get elementsBounds(): RectBounds {
// 		let minLeft: number = 0
// 		let maxRight: number = this.getters.canvas.width
// 		let minTop: number = 0
// 		let maxBottom: number = this.getters.canvas.height
// 		let res: RectBounds

// 		this.getters.cellList.filter( isInclude ).map( get )

// 		function get( cell ) {
// 			minLeft = getCellMin( "__left", minLeft )
// 			maxRight = getCellMax( "__right", maxRight )
// 			minTop = getCellMin( "__top", minTop )
// 			maxBottom = getCellMax( "__bottom", maxBottom )

// 			function getCellMin( key, refer ): number {
// 				return getCellComparedResult( key, refer, isSmailler )
// 			}
// 			function getCellMax( key, refer ): number {
// 				return getCellComparedResult( key, refer, isBigger )
// 			}

// 			function getCellComparedResult( key, refer, compare ): number {
// 				const value = cell[ key ]
// 				let res = refer
// 				if ( !_.isNil( value ) ) {
// 					if ( compare( value, refer ) ) {
// 						res = value
// 					}
// 				}
// 				return res
// 			}

// 			function isBigger( a, b ) {
// 				return a > b
// 			}
// 			function isSmailler( a, b ) {
// 				return a < b
// 			}
// 		}

// 		function isInclude( cell ): boolean {
// 			const res: boolean = ! _.includes(
// 				excludingTypesForMiniMapElementsBounds,
// 				cell.type
// 			)
// 			return res
// 		}

// 		res = {
// 			left  : minLeft,
// 			top   : minTop,
// 			width : maxRight - minLeft,
// 			height: maxBottom - minTop
// 		}

// 		return res
// 	}

// 	get scopeRect(): RectBounds {
// 		const zoom = this.canvasScopeZoom
// 		const center: Point2D = {
// 			x: this.getters.canvas.width / 2,
// 			y: this.getters.canvas.height / 2
// 		}
// 		const res = {
// 			left  : center.x - this.getters.canvas.width / 2 * zoom,
// 			top   : center.x - this.getters.canvas.height / 2 * zoom,
// 			width : this.getters.canvas.width * zoom,
// 			height: this.getters.canvas.height * zoom
// 		}
// 		return res
// 	}

// 	/**
// 	 * Zoom used to contain main elements' bounds
// 	 */
// 	get canvasScopeZoom(): number {
// 		let maxZoom: number = 1

// 		const b = this.elementsBounds
// 		const center: Point2D = {
// 			x: this.getters.canvas.width / 2,
// 			y: this.getters.canvas.height / 2
// 		}

// 		const leftZoom = Math.abs( ( center.x - b.left ) / center.x )
// 		const rightZoom = Math.abs( ( b.left + b.width - center.x ) / center.x )
// 		const topZoom = Math.abs( ( center.y - b.top ) / center.y )
// 		const bottomZoom = Math.abs( ( b.top + b.height - center.y ) / center.y )

// 		const max = Math.max( leftZoom, rightZoom, topZoom, bottomZoom )

// 		maxZoom = max > maxZoom ? max : maxZoom
// 		return maxZoom
// 	}

// 	get transformRatio(): number {
// 		const res = this.sizeRate / this.canvasScopeZoom
// 		return res
// 	}

// 	get deltaXForAutoZoom(): number {
// 		const res =
// 			( this.sizeRate * this.getters.canvas.width -
// 				this.transformRatio * this.getters.canvas.width ) /
// 			2
// 		return res
// 	}

// 	get deltaYForAutoZoom(): number {
// 		const res =
// 			( this.sizeRate * this.getters.canvas.height -
// 				this.transformRatio * this.getters.canvas.height ) /
// 			2
// 		return res
// 	}

// 	constructor( props ) {
// 		super( props )

// 		this.width = this.getters.canvas.width * this.sizeRate
// 		this.height = getters.canvas.height * this.sizeRate
// 		this.left = 0
// 		this.top = getters.canvas.height - this.height
// 		this.viewBox = new ViewBox( {
// 			draw   : this.draw,
// 			miniMap: this
// 		} )
// 	}

// 	/**
// 	 * Render
// 	 * Caveat: Have to get image data at the begginning of rendering process of draw
// 	 */
// 	public render() {
// 		if ( isNotNil( this.imageData ) ) {
// 			this.getters.ctx.putImageData( this.imageData, this.left, this.top )
// 		}
// 	}

// 	/**
// 	 * Get mini map's image data at the begginning of rendering process of draw
// 	 */
// 	public renderMainToGetImageData() {
// 		this.renderMain()
// 		this.imageData = this.getters.ctx.getImageData(
// 			this.left,
// 			this.top,
// 			this.width,
// 			this.height
// 		)
// 	}

// 	public renderMain() {
// 		this.isRendering = true

// 		const self = this

// 		_renderContainer()
// 		this.viewBox.renderByMiniMap()

// 		_renderGrid()
// 		_renderCanvasMain()

// 		this.isRendering = false
// 		function _renderContainer() {
// 			const ctx = this.getters.ctx
// 			ctx.save()

// 			ctx.translate( self.originX, self.originY )

// 			ctx.fillStyle = "white"
// 			ctx.fill( self.path )
// 			ctx.lineWidth = 1
// 			ctx.strokeStyle = "#666"
// 			ctx.stroke( self.path )

// 			ctx.restore()
// 		}

// 		function _renderCanvasMain() {
// 			this.getters.cellList.map( renderElement )
// 		}

// 		function _renderGrid() {
// 			const origin: Point2D = {
// 				x: 0,
// 				y: self.top
// 			}
// 			renderGridMiniMap( {
// 				canvas                  : this.getters.canvas,
// 				width                   : self.width,
// 				height                  : self.height,
// 				origin,
// 				zoom                    : self.transformRatio,
// 				deltaXForZoom           : self.deltaXForAutoZoom,
// 				deltaYForZoom           : self.deltaYForAutoZoom,
// 				strokeStyleForSmallSpace: "rgba( 0, 0, 0, 0.05)",
// 				strokeStyleForBigSpace  : "rgba( 0, 0, 0, 0.2 )"
// 			} )
// 		}
// 	}

// 	public transformCenterPointForContext( point: Point2D ) {
// 		/**
// 		 * Transform point from original position to mini map
// 		 */
// 		let transformedPoint: Point2D = {
// 			x: point.x * this.transformRatio + this.deltaXForAutoZoom,
// 			y: point.y * this.transformRatio + this.top + this.deltaYForAutoZoom
// 		}

// 		this.getters.ctx.setTransform(
// 			this.transformRatio,
// 			0,
// 			0,
// 			this.transformRatio,
// 			transformedPoint.x,
// 			transformedPoint.y
// 		)
// 	}

// 	public contain( x, y ) {
// 		const self = this

// 		const staticBasicOriginalCanvasCenterPoint = this.getters.canvasCenterPoint
// 		// const currentOriginalCanvasCenterPoint = this.draw.zoomPan.transformPointReversely(
// 		// 	this.getters.canvasCenterPoint
// 		// )

// 		// const deltaX =
// 		// 	currentOriginalCanvasCenterPoint.x -
// 		// 	staticBasicOriginalCanvasCenterPoint.x
// 		// const deltaY =
// 		// 	currentOriginalCanvasCenterPoint.y -
// 		// 	staticBasicOriginalCanvasCenterPoint.y

// 		const transformedPoint = getTransformedPointForContainPoint()

// 		const isContain = this.getters.ctx.isPointInPath(
// 			this.path,
// 			transformedPoint.x,
// 			transformedPoint.y
// 		)

// 		return isContain

// 		function getTransformedPointForContainPoint(): Point2D {
// 			// const originPoint: Point2D = {
// 			// 	x: x - deltaX * self.transformRatio,
// 			// 	y: y - deltaY * self.transformRatio
// 			// }
// 			// const viewBoxOriginPoint: Point2D = {
// 			// 	x: self.originX,
// 			// 	y: self.originY
// 			// }
// 			// const res: Point2D = {
// 			// 	x:
// 			// 		( originPoint.x - viewBoxOriginPoint.x ) *
// 			// 		self.canvasScopeZoom,
// 			// 	y:
// 			// 		( originPoint.y - viewBoxOriginPoint.y ) *
// 			// 		self.canvasScopeZoom
// 			// }
// 			// return res
// 			return
// 		}
// 	}
// }

// class ViewBox extends Cell {
// 	type: string = MINI_MAP_VIEW_BOX
// 	public miniMap: MiniMap

// 	constructor( props ) {
// 		super( props )

// 		this.miniMap = props.miniMap
// 	}

// 	get path(): Path2D {
// 		const path = new Path2D()
// 		path.rect(
// 			-this.miniMap.width / 2,
// 			-this.miniMap.height / 2,
// 			this.miniMap.width,
// 			this.miniMap.height
// 		)
// 		return path
// 	}

// 	get originX(): number {
// 		const res = this.miniMap.originX
// 		return res
// 	}

// 	get originY(): number {
// 		const res = this.miniMap.originY
// 		return res
// 	}

// 	public renderByMiniMap() {
// 		const ctx = this.getters.ctx
// 		// let zoom: number = this.draw.zoomPan.zoom * this.miniMap.canvasScopeZoom

// 		ctx.save()

// 		const transformedPoint = this.transformPoint( {
// 			x: this.originX,
// 			y: this.originY
// 		} )

// 		// ctx.setTransform(
// 		// 	1 / zoom,
// 		// 	0,
// 		// 	0,
// 		// 	1 / zoom,
// 		// 	transformedPoint.x,
// 		// 	transformedPoint.y
// 		// )

// 		ctx.lineWidth = 1
// 		ctx.strokeStyle = "red"
// 		ctx.stroke( this.path )

// 		ctx.restore()
// 	}

// 	public contain( x, y ) {
// 		// const self = this

// 		// const staticBasicOriginalCanvasCenterPoint = this.getters.canvasCenterPoint
// 		// const currentOriginalCanvasCenterPoint = this.draw.zoomPan.transformPointReversely(
// 		// 	this.getters.canvasCenterPoint
// 		// )

// 		// const deltaX =
// 		// 	currentOriginalCanvasCenterPoint.x -
// 		// 	staticBasicOriginalCanvasCenterPoint.x
// 		// const deltaY =
// 		// 	currentOriginalCanvasCenterPoint.y -
// 		// 	staticBasicOriginalCanvasCenterPoint.y

// 		// const transformedPoint = getTransformedPointForContainPoint()

// 		// const isContain = this.getters.ctx.isPointInPath(
// 		// 	this.path,
// 		// 	transformedPoint.x,
// 		// 	transformedPoint.y
// 		// )

// 		// return isContain

// 		function getTransformedPointForContainPoint(): Point2D {
// 			// const originPoint: Point2D = {
// 			// 	x: x - deltaX * self.miniMap.transformRatio,
// 			// 	y: y - deltaY * self.miniMap.transformRatio
// 			// }
// 			// const viewBoxOriginPoint: Point2D = {
// 			// 	x: self.originX,
// 			// 	y: self.originY
// 			// }
// 			// const res: Point2D = {
// 			// 	x:
// 			// 		( originPoint.x - viewBoxOriginPoint.x ) *
// 			// 		self.draw.zoomPan.zoom *
// 			// 		self.miniMap.canvasScopeZoom,
// 			// 	y:
// 			// 		( originPoint.y - viewBoxOriginPoint.y ) *
// 			// 		self.draw.zoomPan.zoom *
// 			// 		self.miniMap.canvasScopeZoom
// 			// }
// 			// return res
// 			return
// 		}
// 	}

// 	transformPoint( point: Point2D ) {
// 		const staticBasicOriginalCanvasCenterPoint = this.getters.canvasCenterPoint
// 		// const currentOriginalCanvasCenterPoint = this.draw.zoomPan.transformPointReversely(
// 		// 	this.getters.canvasCenterPoint
// 		// )

// 		// const deltaX =
// 		// 	currentOriginalCanvasCenterPoint.x -
// 		// 	staticBasicOriginalCanvasCenterPoint.x
// 		// const deltaY =
// 		// 	currentOriginalCanvasCenterPoint.y -
// 		// 	staticBasicOriginalCanvasCenterPoint.y

// 		// const res = {
// 		// 	x: point.x + deltaX * this.miniMap.transformRatio,
// 		// 	y: point.y + deltaY * this.miniMap.transformRatio
// 		// }

// 		// return res
// 	}


// 	// ******* Pan view box { ******
// 	public updateDrag( event ) {
// 		const pep: Point2D = {
// 			x: this.dragger.prevPoint.x - this.getters.canvasLeft,
// 			y: this.dragger.prevPoint.y - this.getters.canvasTop,
// 		}
// 		// curernt event point
// 		const cep: Point2D = {
// 			x: event.x - this.getters.canvasLeft,
// 			y: event.y - this.getters.canvasTop,
// 		}

// 		const deltaX = ( pep.x - cep.x ) / this.miniMap.sizeRate * this.miniMap.canvasScopeZoom

// 		const deltaY = ( pep.y - cep.y ) /  this.miniMap.sizeRate * this.miniMap.canvasScopeZoom

// 		// const panPointNew: Point2D = {
// 			// x: this.draw.zoomPan.panPoint.x + deltaX,
// 			// y: this.draw.zoomPan.panPoint.y + deltaY,
// 		// }

// 		// coupleZoomPanSetPanPoint( this.draw.zoomPan, panPointNew )
// 		this.draw.render()
// 	}

// 	public handleMouseMove( event ) {
// 		if ( this.dragger.enable || this.contain(
// 			event.x - this.getters.canvasLeft,
// 			event.y - this.getters.canvasTop
// 		) ) {
// 			this.getters.canvas.style.cursor = "-webkit-grab"
// 			return
// 		}
// 		if ( ! this.dragger.enable ) {
// 			this.getters.canvas.style.cursor = "default"
// 			return
// 		}
// 	}
// 	// ******* Pan view box } ******
// }
