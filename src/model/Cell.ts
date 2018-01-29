import * as _ from "lodash"
import { generateUniqueId, isNotNil } from 'util/index';
import Draw from "Draw"
import * as i from "interface/index"
import * as constant from 'store/constant'
import coupleIsMouseDownToPan from 'mixin/coupleIsMouseDownToPan'

export default abstract class Cell {
	public id: string = generateUniqueId()
	public draw: Draw
	public _isInstance: boolean = true
	public type: string
	public angle: number

	/**
	 * interaction - drag
	 */
	public _prevDraggingPoint: i.Point
	public _isDragging: boolean = false

	/**
	 * interaction - selection
	 */
	public isSelected: boolean = false

	/**
	 * interaction - rotation
	 */
	public isRotating: boolean = false

	/**
	 * interaction - size
	 */
	public isSizing: boolean = false


	/**
	 * Mini map
	 */
	public isVisiableInMiniMap = true

	get radianAngle(): number {
		const res = this.angle * constant.DEGREE_TO_RADIAN
		return res
	}

	get __left(): number {
		const potentialValue = this[ 'left' ]
		const res = isNotNil( potentialValue ) ?  potentialValue : 0
		return res
	}
	get __top(): number {
		const potentialValue = this[ 'top' ]
		const res = isNotNil( potentialValue ) ?  potentialValue : 0
		return res
	}
	get __width(): number {
		const potentialValue = this[ 'width' ]
		const res = isNotNil( potentialValue ) ?  potentialValue : 0
		return res
	}
	get __height(): number {
		const potentialValue = this[ 'height' ]
		const res = isNotNil( potentialValue ) ?  potentialValue : 0
		return res
	}
	get __right(): number {
		const potentialValue = this.__left + this.__width
		const res = isNotNil( potentialValue ) ?  potentialValue : 0
		return res
	}
	get __bottom(): number {
		const potentialValue = this.__top + this.__height
		const res = isNotNil( potentialValue ) ?  potentialValue : 0
		return res
	}


	constructor( props ) {
		const { draw } = props

		this.draw = draw

		this.draw.cellList.push( this )

		this.bindEvents()
	}

	private bindEvents() {
		this.draw.canvas.removeEventListener(
			"mousedown",
			this._mousedownListener
		)
		this.draw.canvas.addEventListener( "mousedown", this._mousedownListener )

		this.draw.canvas.removeEventListener(
			"mousemove",
			this._mousemoveListener
		)
		this.draw.canvas.addEventListener( "mousemove", this._mousemoveListener )

		this.draw.canvas.removeEventListener( "mouseup", this._mouseupListener )
		this.draw.canvas.addEventListener( "mouseup", this._mouseupListener )

		this.draw.canvas.removeEventListener( "click", this._clickListener )
		this.draw.canvas.addEventListener( "click", this._clickListener )
	}

	public _mousedownListener = event => {
		if ( coupleIsMouseDownToPan( this.draw.zoomPan, event ) ) {
			return
		}

		const mostTopCell = this.draw._getMostTopCell( event )

		if ( mostTopCell === this ) {
			this._startDrag( event )
		}
	}

	public _mousemoveListener = event => {
		this._isDragging && this._dragging( event )
		this.handleMouseMove && this.handleMouseMove( event )
	}

	public _mouseupListener = event => {
		this._stopDrag( event )
	}

	public _clickListener = event => {
		const mostTopCell = this.draw._getMostTopCell( event )

		if ( mostTopCell === this ) {
			this.handleClick( event )
		}
	}

	private set( field: string, value: any ) {
		this[ field ] = value
	}

	public render() { }

	// ******* Interaction ******
	// ******* # General ******
	public handleClick( event ) {}
	public handleMouseMove( event ) {}
	// ******* # General ******
	// ******* # Drag ******
	public abstract containPoint( x: number, y: number ): void

	public _updatePrevDraggingPoint( event ) {
		this._prevDraggingPoint = {
			x: event.x,
			y: event.y
		}
	}
	public _updateDrag( event ) { }
	public _startDrag( event ): void {
		this._isDragging = true
		this._updatePrevDraggingPoint( event )
		this.handleStartDrag && this.handleStartDrag( event )
	}
	public _dragging( event ): void {
		this._updateDrag( event )
		this._updatePrevDraggingPoint( event )
		this.handleDragging && this.handleDragging( event )
	}
	public _stopDrag( event ): void {
		this._isDragging = false
		this.handleStopDrag && this.handleStopDrag( event )
	}
	public handleStartDrag( event ) { }
	public handleDragging( event ) { }
	public handleStopDrag( event ) { }
	// ******* # Drag ******
	// ******* Interaction ******


	// ******* Transform ******
	public rotatePoint(
		point: i.Point,
		angle: number,
		centerPoint: i.Point = { x: 0, y: 0 }
	) {
		if ( angle === 0 ) {
			return point
		}

		let resPoint: i.Point = _.cloneDeep( point )
		const alpha = angle * constant.DEGREE_TO_RADIAN

		const relativePoint = {
			x: resPoint.x - centerPoint.x,
			y: resPoint.y - centerPoint.y
		}

		resPoint = {
			x:
				relativePoint.x * Math.cos( alpha ) -
				relativePoint.y * Math.sin( alpha ),
			y:
				relativePoint.x * Math.sin( alpha ) +
				relativePoint.y * Math.cos( alpha )
		}

		return resPoint
	}
	// ******* Transform ******
}
