import Draw from "Draw"
import { isMouseMiddleClick, log } from "util/index"
import * as _ from "lodash"
import getters from "../store/draw/getters";

export default class ZoomPan {
	public draw: Draw
	/**
	 * Original point for pan
	 */
	public panPoint: Point2D= {
		x: 0,
		y: 0
	}

	private _deltaZoom = 0.1

	/**
	 * zoom ratio
	 */
	public _zoom: number = 1
	public MAX_ZOOM = 32
	public MIN_ZOOM = 0.19

	public isZoomBasedOnCenter: boolean = true

	public _prevOriginalZCT: Point2D = null
	public _prevTransformedZCT: Point2D = null
	public _prevZoom = this.zoom
	/**
	 * pan
	 */
	public _isPanning: boolean = false
	public _tmpPointForPan: Point2D
	public _prevPanPoint: Point2D

	public _mouseEvent: any

	set zoom( value: number ) {
		if ( value > this.MAX_ZOOM ) {
			this._zoom = this.MAX_ZOOM
		}
		if ( value < this.MIN_ZOOM ) {
			this._zoom = this.MIN_ZOOM
		}
		if ( value >= this.MIN_ZOOM && value <= this.MAX_ZOOM ) {
			this._zoom = value
		}
	}

	get zoom(): number {
		return this._zoom
	}
	/**
	 * Focus zoom center point
	 */
	get focusZCT(): Point2D {
		let focusZCT: Point2D

		if ( this.isZoomBasedOnCenter ) {
			focusZCT = _.cloneDeep( this.canvasNotZoomedPannedCenterPoint )
			return focusZCT
		}
		if ( !_.isNil( this._mouseEvent ) ) {
			focusZCT = {
				x: this._mouseEvent.x - getters.canvasLeft,
				y: this._mouseEvent.y - getters.canvasTop
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
	get originalZCT(): Point2D {
		const self = this
		let originalPoint: Point2D

		if ( this.isZoomBasedOnCenter || _.isNil( this._mouseEvent ) ) {
			originalPoint = _.cloneDeep( this.canvasNotZoomedPannedCenterPoint )
		}

		if ( !this.isZoomBasedOnCenter && !_.isNil( this._mouseEvent ) ) {
			originalPoint = getOriginalPointByTransformedPoint()
		}

		return originalPoint

		function getOriginalPointByTransformedPoint(): Point2D {
			let originalPoint: Point2D

			if ( !_.isNil( self._prevOriginalZCT ) ) {
				originalPoint = {
					x:
						self._prevOriginalZCT.x +
						( self.focusZCT.x - self._prevTransformedZCT.x ) /
							self._prevZoom,
					y:
						self._prevOriginalZCT.y +
						( self.focusZCT.y - self._prevTransformedZCT.y ) /
							self._prevZoom
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
	get transformedZCT(): Point2D {
		const res: Point2D = this.focusZCT
		return res
	}
	get canvasNotZoomedPannedCenterPoint(): Point2D{
		const res = {
			x: getters.canvas.width / 2,
			y: getters.canvas.height / 2
		}
		return res
	}
	/**
	 * Transitional canvas view
	 */
	get canvasViewCenterPoint(): Point2D{
		const res = {
			x: this.canvasNotZoomedPannedCenterPoint.x * this.zoom,
			y: this.canvasNotZoomedPannedCenterPoint.y * this.zoom
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

	constructor( props ) {
		this.draw = props.draw

		this.bindEvents()
	}

	/**
	 *  transform center point for context
	 */
	public transformCenterPointForContext( point, keepRatio: boolean = false ) {
		const transformedPoint: Point2D= this.transformPoint( point )
		const zoom = ! keepRatio ? this.zoom : 1
		getters.ctx.setTransform(
			zoom,
			0,
			0,
			zoom,
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
	public transformPoint( point ): Point2D{
		const res = {
			x: point.x * this.zoom + this.deltaXForZoom + this.deltaXForPan,
			y: point.y * this.zoom + this.deltaYForZoom + this.deltaYForPan
		}
		return res
	}
	public transformPointReversely( point ): Point2D{
		const res = {
			x: ( point.x - this.deltaXForZoom - this.deltaXForPan ) / this.zoom,
			y: ( point.y - this.deltaYForZoom - this.deltaYForPan ) / this.zoom
		}
		return res
	}

	public bindEvents() {
		getters.canvas.addEventListener(
			"mousewheel",
			this._mousewheelListener.bind( this )
		)
		getters.canvas.addEventListener(
			"mousedown",
			this._mousedownListener.bind( this )
		)
		// getters.canvas.addEventListener('mousemove', this._mousemoveListener.bind(this))
		document.addEventListener(
			"mousemove",
			this._mousemoveListener.bind( this )
		)
		getters.canvas.addEventListener(
			"mouseup",
			this._mouseupListener.bind( this )
		)
	}

	public _mousewheelListener( event ) {
		event.preventDefault()

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
			x: event.x - getters.canvasLeft,
			y: event.y - getters.canvasTop
		}
	}

	public _updatePan( event ) {
		this._updateThePrevious()

		const focusPoint: Point2D = {
			x: event.x - getters.canvasLeft,
			y: event.y - getters.canvasTop
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
