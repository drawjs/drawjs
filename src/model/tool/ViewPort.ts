import zoomPoint from "../../util/geometry/zoom"
import isMouseMiddleClick from "../../util/isMouseMiddleClick"
import { ZOOM_VARIATION, MAX_ZOOM, MIN_ZOOM } from "../../store/constant/index"
import Particle from "../Particle"
import { isNumber } from "../../util/lodash/index"

const { abs, max } = Math

/**
 * View port
 * For that canvas dom is always fixed, and the origin is always ( 0, 0 ),
 * so if we want a convenient viewPort, we have to mock a canvas view
 * port for zooming and panning calculation.
 *
 * Canvas dom is the initial view port(Like initial transfomable rectange)
 * After panned or zoomed, view port(rectangle) would zoom and pan.
 *
 * We calculate the change of every tranformed point's position on
 * canvas based on the special point of tranformed view port:
 * the center point of canvas
 *
 * Points have 3 types: Point2DInitial, Point2DCurrent, PointOnlyZoomed(to become Point2DCurrent)
 *
 * Transform steps:
 * 1. Zoom based on the origin(0, 0)
 * 2. Move the point with movement
 */
export default class ViewPort extends Particle {
	shouldPan: boolean = false
	prevPanningPoint: Point2D

	/**
	 * Zoom rate
	 */
	zoom: number = 1

	static ZOOM_VARIATION: number = ZOOM_VARIATION
	static MAX_ZOOM: number = MAX_ZOOM
	static MIN_ZOOM: number = MIN_ZOOM

	/**
	 * Used to calculate the change of every point's position on
	 * canvas after view port is zoomed and panned
	 */
	center: Point2DCurrent

	constructor( props ) {
		super( props )

		this.center = this.basicCenter
	}

	get basicCenter(): Point2DInitial {
		const { canvasWidth, canvasHeight } = this.getters

		const point: Point2D = {
			x: canvasWidth / 2,
			y: canvasHeight / 2
		}
		return point
	}

	get basicWidth(): number {
		const width: number = this.getters.canvasWidth
		return width
	}

	get basicHeight(): number {
		const height: number = this.getters.canvasHeight
		return height
	}

	get width(): number {
		const { basicWidth, zoom } = this
		const width: number = basicWidth * zoom
		return width
	}

	get height(): number {
		const { basicHeight, zoom } = this
		const height: number = basicHeight * zoom
		return height
	}

	/**
	 * The movement of viewPort when zoom equals 1
	 */
	get pan(): Point2DInitial {
		const { center, basicCenter } = this
		const res: Point2D = {
			x: center.x - basicCenter.x,
			y: center.y - basicCenter.y
		}
		return res

		// const { center, zoom, basicCenter } = this
		// const res: Point2D = {
		// 	x: center.x / zoom - basicCenter.x,
		// 	y: center.y / zoom - basicCenter.y
		// }
		// return res
	}

	get panX(): number {
		return this.pan.x
	}

	get panY(): number {
		return this.pan.y
	}

	get isPanning(): boolean {
		const res: boolean =
			isMouseMiddleClick( event ) ||
			this.getters.eventKeyboard.isSpacePressing

		return res
	}

	/**
	 *  The movement of **zoomed** view port
	 *  Used in canvas.getContext('2d').setTransform
	 */
	get movement(): Point2D {
		const { width, height, basicWidth, basicHeight } = this
		const { x: cx, y: cy } = this.center
		const { x: basicCX, y: basicCY } = this.basicCenter

		const deltaX: number = cx - basicCX - ( ( width - basicWidth ) / 2 )
		const deltaY: number = cy - basicCY - ( ( height - basicHeight ) / 2 )
		const res: Point2D = {
			x: deltaX,
			y: deltaY
		}

		return res
	}


	get movementX(): number {
		const res: number = this.movement.x
		return res
	}

	get movementY(): number {
		const res: number = this.movement.y
		return res
	}

	/**
	 * // Zoom
	 */
	/**
	 * Zoom by
	 * @param center point on current view port
	 */
	zoomBy(
		center: Point2DCurrent = {
			x: 0,
			y: 0
		},
		deltaZoom: number
	) {
		const self = this

		if ( wontBeyondZoomScope() ) {
			return
		}

		const prevZoom: number = this.zoom

		/**
		 * Update zoom
		 */
		this.zoom = this.zoom + deltaZoom

		/**
		 * Update center point
		 */
		const { center: viewPortCenter, basicCenter, zoom } = this

		this.center = zoomPoint( center, zoom / prevZoom, this.center )

		this.draw.render()

		function wontBeyondZoomScope() {
			const potentialNewZoom: number = self.zoom + deltaZoom
			const { MAX_ZOOM, MIN_ZOOM } = ViewPort
			const res: boolean =
				potentialNewZoom > MAX_ZOOM || potentialNewZoom < MIN_ZOOM
			return res
		}
	}
	zoomTo( zoom: number, center: Point2DCurrent = {
		x: 0,
		y: 0
	}, ) {
		const deltaZoom = zoom - this.zoom
		this.zoomBy( center, deltaZoom )
	}
	zoomIn( point: Point2DCurrent = this.getters.canvasCenterPoint ) {
		this.zoomBy( point, ViewPort.ZOOM_VARIATION )
	}
	zoomOut( point: Point2DCurrent = this.getters.canvasCenterPoint ) {
		this.zoomBy( point, -ViewPort.ZOOM_VARIATION )
	}

	/**
	 * // Pan
	 */
	panBy( deltaX: number, deltaY: number ) {
		const { x: centerX, y: centerY }: Point2DCurrent = this.center
		this.center = {
			x: centerX + deltaX,
			y: centerY + deltaY
		}
	}


	getDeltaPointToPrevPanningPoint( point ): Point2DCurrent {
		const { x, y }: Point2DCurrent = point
		const { x: prevX, y: prevY } = this.prevPanningPoint

		const deltaPoint: Point2DCurrent = {
			x: x - prevX,
			y: y - prevY
		}
		return deltaPoint
	}

	getDeltaXToPrevPanningPoint( point ): number {
		const deltaPoint: Point2DCurrent = this.getDeltaPointToPrevPanningPoint(
			point
		)
		return deltaPoint.x
	}

	getDeltaYToPrevPanningPoint( point ): number {
		const deltaPoint: Point2DCurrent = this.getDeltaPointToPrevPanningPoint(
			point
		)
		return deltaPoint.y
	}

	startPan( event ) {
		const point: Point2DCurrent = this.getters.getPoint( event )

		this.shouldPan = true

		this.prevPanningPoint = point
	}

	panning( event ) {
		const point: Point2DCurrent = this.getters.getPoint( event )

		const deltaX: number = this.getDeltaXToPrevPanningPoint( point )
		const deltaY: number = this.getDeltaYToPrevPanningPoint( point )

		this.prevPanningPoint = point

		this.panBy( deltaX, deltaY )

		// this.draw.render()
	}

	stopPan() {
		this.shouldPan = false
	}

	resetPan() {
		this.center = this.basicCenter
	}

	/**
	 * Transform point on initial view port to current view port
	 */
	transform( point: Point2DInitial ): Point2DCurrent {
		const { x, y }: Point2DInitial = point
		const { movementX, movementY, zoom } = this
		const res: Point2DCurrent = {
			x: x * zoom + movementX,
			y: y * zoom + movementY
		}
		return res
	}

	/**
	 * Transform real-time point on canvas to the point on initial view port
	 */
	transformToInitial( point: Point2DCurrent ): Point2DInitial {
		const { x, y }: Point2DInitial = point
		const { movementX, movementY, zoom } = this
		const res: Point2DInitial = {
			x: ( x - movementX ) / zoom,
			y: ( y - movementY ) / zoom
		}
		return res
	}

	/**
	 * Center layout with its bounds
	 */
	centerLayout( bounds: Bounds ) {
		const { left, top, right, bottom } = bounds
		if ( [ left, top, right, bottom ].some( value => !isFinite( value ) ) ) {
			return
		}
		const padding = 100
		const boundsCenter = {
			x: ( left + right ) / 2,
			y: ( top + bottom ) / 2
		}
		const boundsWidth = abs( right - left ) + padding
		const boundsHeight = abs( bottom - top ) + padding

		const { canvasWidth, canvasHeight, canvasCenterPoint } = this.getters

		this.panCanvasCenterToPoint( boundsCenter )

		const xRate = boundsWidth / canvasWidth
		const yRate = boundsHeight / canvasHeight
		const rate = max( xRate, yRate )
		const zoom = rate !== 0 ? 1 / rate : 1
		this.zoomTo( zoom, canvasCenterPoint )
	}

	panCanvasCenterToPoint( point: Point2DInitial ) {
		const { canvasCenterPoint } = this.getters
		const transformedPoint = this.transform( point )
		const { x, y } = transformedPoint

		const { x: x1, y: y1 } = canvasCenterPoint

		const dx = ( x1 - x )
		const dy = ( y1 - y )

		this.panBy( dx, dy )
	}

	/**
	 * Update viewport
	 */
	update( zoom: number, center: Point2DCurrent ) {
		this.zoomTo( zoom )

		const { x, y } = center
		const { x: cx, y: cy } = this.center
		const dx = x - cx
		const dy = y - cy
		this.panBy( dx, dy )
	}
}
