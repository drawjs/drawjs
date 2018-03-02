import * as _ from "lodash"
import { generateUniqueId, isNotNil } from "util/index"
import Draw from "Draw"
import * as constant from "store/constant/index"
import coupleIsMouseDownToPan from "mixin/coupleIsMouseDownToPan"
import { ADD_ELEMENT_TO_CELL_LIST } from "../store/draw/actions";
import getters from "../store/draw/getters";
import getters from 'store/core/getters';

export default abstract class Cell {
	public id: string = generateUniqueId()
	public draw: Draw
	public _isInstance: boolean = true
	public type: string
	public angle: number

	/**
	 * interaction - drag
	 */
	public _prevDraggingPoint: Point2D
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
		const potentialValue = this[ "left" ]
		const res = isNotNil( potentialValue ) ? potentialValue : 0
		return res
	}
	get __top(): number {
		const potentialValue = this[ "top" ]
		const res = isNotNil( potentialValue ) ? potentialValue : 0
		return res
	}
	get __width(): number {
		const potentialValue = this[ "width" ]
		const res = isNotNil( potentialValue ) ? potentialValue : 0
		return res
	}
	get __height(): number {
		const potentialValue = this[ "height" ]
		const res = isNotNil( potentialValue ) ? potentialValue : 0
		return res
	}
	get __right(): number {
		const potentialValue = this.__left + this.__width
		const res = isNotNil( potentialValue ) ? potentialValue : 0
		return res
	}
	get __bottom(): number {
		const potentialValue = this.__top + this.__height
		const res = isNotNil( potentialValue ) ? potentialValue : 0
		return res
	}

	constructor( props ) {
		const { draw } = props

		this.draw = draw

		ADD_ELEMENT_TO_CELL_LIST( this )

		this.bindEvents()
	}

	private bindEvents() {
		getters.canvas.removeEventListener(
			"mousedown",
			this._mousedownListener
		)
		getters.canvas.addEventListener( "mousedown", this._mousedownListener )

		getters.canvas.removeEventListener(
			"mousemove",
			this._mousemoveListener
		)
		getters.canvas.addEventListener( "mousemove", this._mousemoveListener )

		getters.canvas.removeEventListener( "mouseup", this._mouseupListener )
		getters.canvas.addEventListener( "mouseup", this._mouseupListener )

		getters.canvas.removeEventListener( "click", this._clickListener )
		getters.canvas.addEventListener( "click", this._clickListener )
	}

	public _mousedownListener = event => {
		if ( coupleIsMouseDownToPan( this.draw.zoomPan, event ) ) {
			return
		}

		const point = getters.getPoint( event )
		const mostTopCell = getters.getMostTopCellFocus( point )

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
		const point = getters.getPoint( event )
		const mostTopCell = getters.getMostTopCellFocus( point )

		if ( mostTopCell === this ) {
			this.handleClick( event )
		}
	}

	private set( field: string, value: any ) {
		this[ field ] = value
	}

	public render() {}

	// ******* Interaction ******
	// ******* # General ******
	public handleClick( event ) {}
	public handleMouseMove( event ) {}
	// ******* # General ******
	// ******* # Drag ******
	public abstract contain( x: number, y: number ): void

	public _updatePrevDraggingPoint( event ) {
		this._prevDraggingPoint = {
			x: event.x,
			y: event.y
		}
	}
	public _updateDrag( event ) {}
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
	public handleStartDrag( event ) {}
	public handleDragging( event ) {}
	public handleStopDrag( event ) {}
	// ******* # Drag ******
	// ******* Interaction ******
}
