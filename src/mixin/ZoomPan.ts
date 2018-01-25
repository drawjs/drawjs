import * as i from "interface/index"
import Draw from "Draw"
import { isMouseMiddleClick, log } from "util/index"
import { Point } from "interface/index"
import * as _ from "lodash"

export default class ZoomPan {
	public draw: Draw
	/**
	 * Original point for pan
	 */
	public panPoint: i.Point = {
		x: 0,
		y: 0
	}

	private _deltaZoom = 0.1

	/**
	 * zoom rate
	 */
	public zoom: number = 1

	public isZoomBasedOnCenter: boolean = false

	public _prevOriginalZCT: Point = null
	public _prevTransformedZCT: Point = null
	public _prevZoom = this.zoom
	/**
	 * pan
	 */
	public _isPanning: boolean = false
	public _tmpPointForPan: i.Point
	public _prevPanPoint: i.Point

	public _mouseEvent: any

	/**
	 * Set delta point for transformed point in `transformCenterPointForContext`,
	 * for example, set this to render cells in mini map
	 */
	public deltaPointForMiniMap: Point = {
		x: 0,
		y: 0
	}

	/**
	 * Focus zoom center point
	 */
	get focusZCT(): Point {
		let focusZCT: Point
		if ( this.isZoomBasedOnCenter ) {
			focusZCT = _.cloneDeep( this.canvasNotZoomedPannedCenterPoint )
			return focusZCT
		}
		if ( ! _.isNil( this._mouseEvent ) ) {
			focusZCT = {
				x: this._mouseEvent.x - this.draw.canvasLeft,
				y: this._mouseEvent.y - this.draw.canvasTop
			}
		}
		if ( _.isNil( this._mouseEvent ) ) {
			focusZCT = {
				x: this.canvasNotZoomedPannedCenterPoint.x * this.zoom,
				y: this.canvasNotZoomedPannedCenterPoint.y * this.zoom
			}
		}

		focusZCT

		return focusZCT
	}

	/**
	 * Original zoom center point
	 */
	get originalZCT(): Point {
		const self = this
		let originalPoint: Point
		if ( this.isZoomBasedOnCenter || _.isNil( this._mouseEvent ) ) {
			originalPoint = _.cloneDeep( this.canvasNotZoomedPannedCenterPoint )
		}
		if ( ! this.isZoomBasedOnCenter && ! _.isNil( this._mouseEvent ) ) {
			originalPoint = getOriginalPointByTransformedPoint()
		}
		return originalPoint

		function getOriginalPointByTransformedPoint(): Point {
			let originalPoint: Point

			if ( ! _.isNil( self._prevOriginalZCT ) ) {
				originalPoint = {
					x: self._prevOriginalZCT.x + ( self.focusZCT.x - self._prevTransformedZCT.x) / self._prevZoom,
					y: self._prevOriginalZCT.y + ( self.focusZCT.y - self._prevTransformedZCT.y) / self._prevZoom,
				}
			}

			if ( _.isNil( self._prevOriginalZCT ) ) {
				originalPoint = self.focusZCT
			}

			return originalPoint
		}
	}
	/**
	 * Transformed zoom center point
	 */
	get transformedZCT(): Point {
		const res: Point = this.focusZCT
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
	get deltaXForZoom(): number {
		const res = this.focusZCT.x - this.originalZCT.x * this.zoom
		return res
	}
	get deltaYForZoom(): number {
		const res = this.focusZCT.y - this.originalZCT.y * this.zoom
		return res
	}
	get deltaXForPan(): number {
		const res: number = this.panPoint.x * this.zoom
		return res
	}
	get deltaYForPan(): number {
		const res: number = this.panPoint.y * this.zoom
		return res
	}
	get tmp_deltaXForZoom(): number {
		const res = -(
			this.canvasViewCenterPoint.x - this.canvasNotZoomedPannedCenterPoint.x
		) + this.panPoint.x
		return res
	}
	get tmp_deltaYForZoom(): number {
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
		let transformedPoint: i.Point = this.transformPoint( point )
		// transformedPoint = {
		// 	x: transformedPoint.x + this.deltaPointForMiniMap.x,
		// 	y: transformedPoint.y + this.deltaPointForMiniMap.y,
		// }
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
			x: point.x * this.zoom + this.deltaXForZoom + this.deltaXForPan + this.deltaPointForMiniMap.x,
			y: point.y * this.zoom + this.deltaYForZoom + this.deltaYForPan + this.deltaPointForMiniMap.y
		}
		return res
	}
	public transformPointReversely( point ): i.Point {
		const res = {
			x: ( point.x - this.deltaXForZoom - this.deltaXForPan - this.deltaPointForMiniMap.x ) / this.zoom,
			y: ( point.y - this.deltaYForZoom - this.deltaYForPan - this.deltaPointForMiniMap.y ) / this.zoom
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

		this._updateTmpPointForPan( event )
	}

	public _updateTmpPointForPan( event ) {
		this._tmpPointForPan = {
			x: event.x - this.draw.canvasLeft,
			y: event.y - this.draw.canvasTop
		}
	}

	public _updatePan( event ) {
		this._updateThePrevious()

		const focusPoint: Point = {
			x: event.x - this.draw.canvasLeft ,
			y: event.y - this.draw.canvasTop
		}

		const deltaX = focusPoint.x - this._tmpPointForPan.x
		const deltaY = focusPoint.y - this._tmpPointForPan.y

		this.panPoint = {
			x: this.panPoint.x + deltaX / this.zoom,
			y: this.panPoint.y + deltaY / this.zoom
		}

		this.draw.render()
	}

	public _startPan( event ) {
		this._isPanning = true
		this._updateTmpPointForPan( event )
	}

	public _panning( event ) {
		this._updatePan( event )
		this._updateTmpPointForPan( event )
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
	 * Update some of the previous
	 */
	public _updateThePrevious() {
		this._prevZoom = this.zoom
		this._prevOriginalZCT = this.originalZCT
		this._prevTransformedZCT = this.transformedZCT
		this._prevPanPoint = this.panPoint
	}
}
