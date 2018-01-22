import * as i from "interface/index"
import Draw from "Draw"
import { isMouseMiddleClick } from 'util/index'


export default class ZoomPan {
	public draw: Draw
	public panPoint: i.Point = {
		x: 0,
		y: 0,
	}


	private _deltaZoom = 0.3

	/**
	 * zoom rate
	 */
	public zoom: number = 1

	/**
	 * pan
	 */
	public _isPanning: boolean = false
	public _prevPointPanned: i.Point

	get canvasCenterPoint(): i.Point {
		const res = {
			x: this.draw.canvas.width / 2 * this.zoom,
			y: this.draw.canvas.height / 2 * this.zoom,
		}
		return res
	}
	get canvasNotZoomedCenterPoint(): i.Point {
		const res = {
			x: this.draw.canvas.width / 2,
			y: this.draw.canvas.height / 2,
		}
		return res
	}
	get canvasViewCenterPoint(): i.Point {
		const res = {
			x: this.canvasCenterPoint.x,
			y: this.canvasCenterPoint.y,
		}
		return res
	}
	get deltaXForZoomPan(): number {
		return - ( this.canvasViewCenterPoint.x - this.canvasNotZoomedCenterPoint.x ) + this.panPoint.x
	}
	get deltaYForZoomPan(): number {
		return - ( this.canvasViewCenterPoint.y - this.canvasNotZoomedCenterPoint.y ) + this.panPoint.y
	}

	constructor( props ) {
		this.draw = props.draw

		this.bindEvents()
	}

	/**
	 * transform center point
	 */
	public setTransformCenterPoint( point ) {
		const transformedPoint: i.Point = this.transformPoint( point )
		this.draw.ctx.setTransform( this.zoom, 0, 0, this.zoom, transformedPoint.x, transformedPoint.y )
	}

	/**
	 * transform point
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
		this.draw.canvas.addEventListener( 'mousewheel', this._mousewheelListener.bind( this ) )
		this.draw.canvas.addEventListener( 'mousedown', this._mousedownListener.bind( this ) )
		// this.draw.canvas.addEventListener('mousemove', this._mousemoveListener.bind(this))
		document.addEventListener( 'mousemove', this._mousemoveListener.bind( this ) )
		this.draw.canvas.addEventListener( 'mouseup', this._mouseupListener.bind( this ) )

	}

	public _mousewheelListener( event ) {

		const { deltaX, deltaY }: { deltaX: number, deltaY: number } = event

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
		if ( isMouseMiddleClick( event ) || this.draw.eventKeyboard.isSpacePressing() ) {
			this._startPan( event )
		}
	}

	public _mousemoveListener( event ) {
		this._isPanning && this._panning( event )
	}

	public _updatePrevPointPanned( event ) {
		this._prevPointPanned = {
			x: event.x - this.draw.canvasLeft,
			y: event.y - this.draw.canvasTop
		}
	}

	public _updatePan( event ) {
		const deltaX = - ( this._prevPointPanned.x - ( event.x - this.draw.canvasLeft ) )
		const deltaY = - ( this._prevPointPanned.y - ( event.y - this.draw.canvasTop ) )

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

	public _mouseupListener( event ) {
		this._isPanning = false

		this._prevPointPanned = {
			x: event.x - this.draw.canvasLeft,
			y: event.y - this.draw.canvasTop
		}
	}

	public _zoomIn() {
		this.zoom = this.zoom + this._deltaZoom
		this.draw.render()
	}

	public _zoomOut() {
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
		return isMouseMiddleClick( event ) || this.draw.eventKeyboard.isSpacePressing()
	}
}
