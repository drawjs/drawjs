import * as _ from "lodash"
import { generateUniqueId, isNotNil } from "util/index"
import Draw from "Draw"
import * as constant from "store/constant/index"
import coupleIsMouseDownToPan from "mixin/coupleIsMouseDownToPan"
import { ADD_ELEMENT_TO_CELL_LIST } from "../store/draw/actions";
import getters from 'store/draw/getters';

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
	public shouldDrag: boolean = false

	/**
	 * interaction - selection
	 */
	shouldSelect: boolean = false

	/**
	 * interaction - rotation
	 */
	shouldRotate: boolean = false

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
	}


	private set( field: string, value: any ) {
		this[ field ] = value
	}

	public render() {}

	// ******* Interaction ******
	// ******* # Drag ******
	public abstract contain( x: number, y: number ): void

	public updatePrevDraggingPoint( event ) {
		this._prevDraggingPoint = {
			x: event.x,
			y: event.y
		}
	}
	public updateDrag( event ) {}
	public startDrag( event ): void {
		this.shouldDrag = true
		this.updatePrevDraggingPoint( event )
		this.handleStartDrag && this.handleStartDrag( event )
	}
	public dragging( event ): void {
		this.updateDrag( event )
		this.updatePrevDraggingPoint( event )
		this.handleDragging && this.handleDragging( event )
	}
	public stopDrag( event ): void {
		this.shouldDrag = false
		this.handleStopDrag && this.handleStopDrag( event )
	}
	public handleStartDrag( event ) {}
	public handleDragging( event ) {}
	public handleStopDrag( event ) {}
	// ******* # Drag ******
	// ******* Interaction ******
}
