import * as _ from "lodash"
import { generateUniqueId, isNotNil } from "util/index"
import Draw from "Draw"
import * as constant from "store/constant/index"
import Dragger from './tool/Dragger';
import Getters from '../store/draw/Getters';
import Actions from '../store/draw/Actions';
import DrawStore from '../store/draw/DrawStore';
import Particle from "./Particle";

export default abstract class Cell extends Particle {
	id: string = generateUniqueId()
	_isInstance: boolean = true
	type: string
	angle: number

	/**
	 * interaction - drag
	 */
	dragger:Dragger

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
	isSizing: boolean = false

	/**
	 * Mini map
	 */
	isVisiableInMiniMap = true

	constructor( props ) {
		super( props )

		this.dragger = new Dragger( { draw: this.draw } )
		this.dragger.update = this.updateDrag.bind( this )
		this.dragger.handleStart = this.handleStartDrag.bind( this )
		this.dragger.handleDragging = this.handleDragging.bind( this )
		this.dragger.handleStop = this.handleStopDrag.bind( this )

		this.actions.ADD_ELEMENT_TO_CELL_LIST( this )
	}


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

	private set( field: string, value: any ) {
		this[ field ] = value
	}

	render() {}

	abstract contain( x: number, y: number ): void

	/**
	 * // Interaction
	 */
	updateDrag( event ) {
		return this.dragger.update( event )
	}
	handleStartDrag( event ) {
	}
	handleDragging( event ) {
	}
	handleStopDrag( event ) {
	}
}
