import getters from "store/draw/getters"
import zoomPoint from "util/geometry/zoom"
import isMouseMiddleClick from "../../util/isMouseMiddleClick"
import { ZOOM_VARIATION, MAX_ZOOM, MIN_ZOOM } from "../../store/constant/index"

const { abs } = Math

/**
 * View port
 * For that canvas is always fixed, and the origin is always ( 0, 0 ),
 * so if we want a convenient viewPort, we have to mock canvas view
 * port used for zooming and panning calculation.
 *
 * Canvas dom is the initial view port(Like initial transfomable rectange)
 * After panned or zoomed, view port(rectangle) would zoom and pan.
 *
 * We can calculate the change of every tranformed point's position on
 * canvas based on tranformed view port's special point:
 * the center point of canvas
 */
export default class ViewPort {
	shouldPan: boolean = false
	prevZoomingPoint: Point2D

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

	get basicCenter(): Point2DInitial {
		const { canvasWidth, canvasHeight } = getters

		const point: Point2D = {
			x: canvasWidth / 2,
			y: canvasHeight / 2
		}
		return point
	}

	get basicWidth(): number {
		const width: number = getters.canvasWidth
		return width
	}

	get basicHeight(): number {
		const height: number = getters.canvasHeight
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
	get pan(): Point2DCurrent {
		const { center, zoom, basicCenter } = this
		const res: Point2D = {
			x: center.x / zoom - basicCenter.x,
			y: center.y / zoom - basicCenter.y
		}
		return res
	}

	get panX(): number {
		return this.pan.x
	}

	get panY(): number {
		return this.pan.y
	}

	get isPanning(): boolean {
		const res: boolean =
			isMouseMiddleClick( event ) || getters.eventKeyboard.isSpacePressing

		return res
	}

	constructor() {
		this.center = this.basicCenter
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

		if ( willNotInScope() ) {
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

		getters.draw.render()

		function willNotInScope() {
			const potentialNewZoom: number = self.zoom + deltaZoom
			const { MAX_ZOOM, MIN_ZOOM } = ViewPort
			const res: boolean =
				potentialNewZoom > MAX_ZOOM || potentialNewZoom < MIN_ZOOM
			return res
		}
	}
	zoomIn( point: Point2DCurrent ) {
		this.zoomBy( point, ViewPort.ZOOM_VARIATION )
	}
	zoomOut( point: Point2DCurrent ) {
		this.zoomBy( point, -ViewPort.ZOOM_VARIATION )
	}

	/**
	 * // Pan
	 */
	panBy( deltaX: number, deltaY: number ) {
		const { x: centerX, y: centerY }: Point2D = this.center
		this.center = {
			x: centerX + deltaX,
			y: centerY + deltaY
		}
	}

	getDeltaPointToPrevPanningPoint( point ): Point2DCurrent {
		const { x, y }: Point2D = point
		const { x: prevX, y: prevY } = this.prevZoomingPoint

		const deltaPoint: Point2D = {
			x: x - prevX,
			y: y - prevY
		}
		return deltaPoint
	}

	getDeltaXToPrevPanningPoint( point ): number {
		const deltaPoint: Point2D = this.getDeltaPointToPrevPanningPoint( point )
		return deltaPoint.x
	}

	getDeltaYToPrevPanningPoint( point ): number {
		const deltaPoint: Point2D = this.getDeltaPointToPrevPanningPoint( point )
		return deltaPoint.y
	}

	startPan( event ) {
		const point: Point2DCurrent = getters.getPoint( event )

		this.shouldPan = true

		this.prevZoomingPoint = point
	}

	panning( event ) {
		const point: Point2DCurrent = getters.getPoint( event )

		const deltaX: number = this.getDeltaXToPrevPanningPoint( point )
		const deltaY: number = this.getDeltaYToPrevPanningPoint( point )

		this.prevZoomingPoint = point

		this.panBy( deltaX, deltaY )

		getters.draw.render()
	}

	stopPan() {
		this.shouldPan = false
	}

	/**
	 * Transform point on initial view port to current view port
	 */
	transform( point: Point2DInitial ): Point2DCurrent {
		const { x, y }: Point2DInitial = point
		const { zoom, panX, panY } = this
		const res: Point2DCurrent = {
			x: ( x + panX ) * zoom,
			y: ( y + panY ) * zoom
		}
		return res
	}

	/**
	 * Transform real-time point on canvas to the point on initial view port
	 */
	transformToInitial( point: Point2DCurrent ): Point2DInitial {
		const { x, y } = point
		const { zoom, panX, panY } = this
		const res: Point2DInitial = {
			x: x / zoom - panX,
			y: y / zoom - panY
		}
		return res
	}
}
