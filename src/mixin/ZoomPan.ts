import * as i from "interface/index"
import Draw from "Draw"
import { isMouseMiddleClick, log } from "util/index"
import { Point } from "interface/index"
import * as _ from "lodash"

export default class ZoomPan {
	public draw: Draw
	public panPoint: i.Point = {
		x: 0,
		y: 0
	}

	private _deltaZoom = 0.5

	/**
	 * zoom rate
	 */
	public zoom: number = 1

	public isZoomBasedOnCenter: boolean = false

	public _prevZoom = this.zoom
	public _prevDeltaXForZoomPan: number = 0
	public _prevDeltaYForZoomPan: number = 0

	/**
	 * pan
	 */
	public _isPanning: boolean = false
	public _prevPointPanned: i.Point

	public _mouseEvent: any

	get originalZoomCenterPoint(): Point {
		const self = this
		let originalPoint: Point
		if ( this.isZoomBasedOnCenter || _.isNil( this._mouseEvent ) ) {
			originalPoint = _.cloneDeep( this.canvasNotZoomedPannedCenterPoint )
		}
		if ( this.isZoomBasedOnCenter === false && ! _.isNil( this._mouseEvent ) ) {
			// originalPoint = {
			// 	x: 100,
			// 	y: 100,
			// }
			originalPoint = getOriginalPointByTransformedPoint()
			log( originalPoint )
			// originalPoint = point
			// log( this._mouseEvent.x, this.draw.canvasLeft )
		}
		return originalPoint

		function getOriginalPointByTransformedPoint(): Point {
			const transformedPoint = {
				x: self._mouseEvent.x - self.draw.canvasLeft,
				y: self._mouseEvent.y - self.draw.canvasTop
			}
			const originalPoint = {
				x: ( transformedPoint.x - self._prevDeltaXForZoomPan ) / self._prevZoom,
				y: ( transformedPoint.x - self._prevDeltaYForZoomPan ) / self._prevZoom
			}
			return originalPoint
		}
	}
	get transitionalZoomCenterPoint(): Point {
		const res = {
			x: this.originalZoomCenterPoint.x * this.zoom,
			y: this.originalZoomCenterPoint.y * this.zoom,
		}
		return res
	}
	get canvasNotZoomedPannedCenterPoint(): i.Point {
		const res = {
			x: this.draw.canvas.width / 2,
			y: this.draw.canvas.height / 2
		}
		return res
	}
	/**
	 * Transitional canvas view
	 */
	get canvasViewCenterPoint(): i.Point {
		const res = {
			x: this.canvasNotZoomedPannedCenterPoint.x * this.zoom,
			y: this.canvasNotZoomedPannedCenterPoint.y * this.zoom,
		}
		return res
	}
	get deltaXForZoomPan(): number {
		const res = -( this.transitionalZoomCenterPoint.x - this.originalZoomCenterPoint.x )
		return res
	}
	get deltaYForZoomPan(): number {
		const res = -( this.transitionalZoomCenterPoint.y - this.originalZoomCenterPoint.y )
		return res
	}
	get tmp_deltaXForZoomPan(): number {
		const res = -(
			this.canvasViewCenterPoint.x - this.canvasNotZoomedPannedCenterPoint.x
		) + this.panPoint.x
		return res
	}
	get tmp_deltaYForZoomPan(): number {
		const res = -(
			this.canvasViewCenterPoint.y - this.canvasNotZoomedPannedCenterPoint.y
		) + this.panPoint.y
		return res
	}

	constructor( props ) {
		this.draw = props.draw

		this.bindEvents()
	}

	/**
	 *  transform center point for context
	 */
	public transformCenterPointForContext( point ) {
		const transformedPoint: i.Point = this.transformPoint( point )
		this.draw.ctx.setTransform(
			this.zoom,
			0,
			0,
			this.zoom,
			transformedPoint.x,
			transformedPoint.y
		)
	}

	/**
	 * Transform point
	 * Key method:
	 * 1. Suppose that we zoomed the whole canvas based on (0, 0) firstly,
	 * that is, we zoomed the point based on (0, 0)
	 * 2. Then, suppose that we moved the whole canvas to somewhere where canvas's center point
	 * coincided on the zoom(wheel) point of canvas before we zoomed it.
	 */
	public transformPoint( point ): i.Point {
		const res = {
			x: point.x * this.zoom + this.deltaXForZoomPan,
			y: point.y * this.zoom + this.deltaYForZoomPan
		}
		return res
	}
	public transformPointReversely( point ): i.Point {
		const res = {
			x: ( point.x - this.deltaXForZoomPan ) / this.zoom,
			y: ( point.y - this.deltaYForZoomPan ) / this.zoom
		}
		return res
	}

	public bindEvents() {
		this.draw.canvas.addEventListener(
			"mousewheel",
			this._mousewheelListener.bind( this )
		)
		this.draw.canvas.addEventListener(
			"mousedown",
			this._mousedownListener.bind( this )
		)
		// this.draw.canvas.addEventListener('mousemove', this._mousemoveListener.bind(this))
		document.addEventListener(
			"mousemove",
			this._mousemoveListener.bind( this )
		)
		this.draw.canvas.addEventListener(
			"mouseup",
			this._mouseupListener.bind( this )
		)
	}

	public _mousewheelListener( event ) {
		event.preventDefault();

		this._mouseEvent = event

		const { deltaX, deltaY }: { deltaX: number; deltaY: number } = event

		if ( isDecreasing() && this.draw.eventKeyboard.isAltPressing() ) {
			this._zoomIn()
		}

		if ( isIncreasing() && this.draw.eventKeyboard.isAltPressing() ) {
			this._zoomOut()
		}

		function isIncreasing() {
			const res = deltaX > 0 || deltaY > 0
			return res
		}
		function isDecreasing() {
			const res = deltaX < 0 || deltaY < 0
			return res
		}
	}

	public _mousedownListener( event ) {
		if (
			isMouseMiddleClick( event ) ||
			this.draw.eventKeyboard.isSpacePressing()
		) {
			this._startPan( event )
		}
	}

	public _mousemoveListener( event ) {
		this._isPanning && this._panning( event )
	}

	public _mouseupListener( event ) {
		this._isPanning = false

		this._prevPointPanned = {
			x: event.x - this.draw.canvasLeft,
			y: event.y - this.draw.canvasTop
		}
	}

	public _updatePrevPointPanned( event ) {
		this._prevPointPanned = {
			x: event.x - this.draw.canvasLeft,
			y: event.y - this.draw.canvasTop
		}
	}

	public _updatePan( event ) {
		const deltaX = -(
			this._prevPointPanned.x -
			( event.x - this.draw.canvasLeft )
		)
		const deltaY = -(
			this._prevPointPanned.y -
			( event.y - this.draw.canvasTop )
		)

		this.panPoint = {
			x: this.panPoint.x + deltaX,
			y: this.panPoint.y + deltaY
		}

		this.draw.render()
	}

	public _startPan( event ) {
		this._isPanning = true
		this._updatePrevPointPanned( event )
	}

	public _panning( event ) {
		this._updatePan( event )
		this._updatePrevPointPanned( event )
	}

	public _stopPan( event ) {
		this._isPanning = false
	}

	public _zoomIn() {
		this._updateThePrevious()
		this.zoom = this.zoom + this._deltaZoom
		this.draw.render()
	}

	public _zoomOut() {
		this._updateThePrevious()
		this.zoom = this.zoom - this._deltaZoom
		this.draw.render()
	}

	public _panTop(): void {
		this.panPoint.y = this.panPoint.y - 1
		this.draw.render()
	}

	public _panBottom(): void {
		this.panPoint.y = this.panPoint.y + 1
		this.draw.render()
	}

	public _panLeft(): void {
		this.panPoint.x = this.panPoint.x - 1
		this.draw.render()
	}

	public _panRight(): void {
		this.panPoint.x = this.panPoint.x + 1
		this.draw.render()
	}

	public isMouseDownToPan( event ): boolean {
		return (
			isMouseMiddleClick( event ) ||
			this.draw.eventKeyboard.isSpacePressing()
		)
	}

	/**
	 * Update previous zoom, deltaXForZoomPan and deltaYForZoomPan
	 */
	public _updateThePrevious() {
		this._prevZoom = this.zoom
		this._prevDeltaXForZoomPan = this.deltaXForZoomPan
		this._prevDeltaYForZoomPan = this.deltaYForZoomPan
	}
}
