import * as _ from "lodash"
import { generateId, isNotNil } from "../util/index"
import Draw from "Draw"
import * as constant from "../store/constant/index"
import Dragger from "./tool/Dragger"
import Getters from "../store/draw/Getters"
import Actions from "../store/draw/Actions"
import DrawStore from "../store/draw/DrawStore"
import Particle from "./Particle"
import Curve from "./Curve"
import Path from "./Path"
import { DEGREE_TO_RADIAN } from "../store/constant/index"

const { abs } = Math

export default abstract class Cell extends Particle {
	_isInstance: boolean = true
	type: string

	/**
	 * // Angle
	 */
	angle: number = 0
	prevAngle: number = 0

	/**
	 * // Visiable or not
	 */
	show: boolean = true

	/**
	 * // Style
	 */
	fillColor: string= "#000"
	strokeColor: string= "#000"
	strokeWidth: number = 1

	get radian(): number {
		const res = this.angle * constant.DEGREE_TO_RADIAN
		return res
	}

	get deltaAngle(): number {
		const { angle, prevAngle } = this
		const res: number = angle - prevAngle
		return res
	}

	get deltaRadian(): number {
		const res: number = this.deltaAngle * DEGREE_TO_RADIAN
		return res
	}

	/**
	 * // Size
	 */
	kX: number = 1
	kY: number = 1
	prevKX: number = 1
	prevKY: number = 1

	get unitKX(): number {
		const { kX } = this
		return kX === 0 ? 0 : kX / abs( kX )
	}

	get unitKY(): number {
		const { kY } = this
		return kY === 0 ? 0 : kY / abs( kY )
	}

	/**
	 * interaction - selection
	 */
	shouldSelect: boolean = false
	get bounds(): Bounds {
		return {
			left  : 0,
			right : 0,
			top   : 0,
			bottom: 0
		}
	}

	/**
	 * // interaction
	 */
	/**
	 * Drag
	 */
	dragger: Dragger
	draggable: boolean = true

	/**
	 * Rotation
	 */
	shouldRotate: boolean = false

	/**
	 * Size
	 */
	isSizing: boolean = false

	/**
	 * // Mini map
	 */
	isVisiableInMiniMap = true

	/**
	 * // Canvas
	 */
	fill: string = "black"

	constructor( props ) {
		super( props )

		this.fillColor = isNotNil( props.fillColor ) ?
			props.fillColor :
			this.fillColor
		this.show = isNotNil( props.show ) ? props.show : this.show
		this.draggable = isNotNil( props.draggable ) ?
			props.draggable :
			this.draggable

		this.dragger = new Dragger( { draw: this.draw, target: this } )
		this.dragger.update = this.updateDrag.bind( this )
		this.dragger.handleStart = this.handleStartDrag.bind( this )
		this.dragger.handleBeforeDragging = this.handleBeforeDragging.bind( this )
		this.dragger.handleDragging = this.handleDragging.bind( this )
		this.dragger.handleAfterDragging = this.handleAfterDragging.bind( this )
		this.dragger.handleStop = this.handleStopDrag.bind( this )

		this.actions.ADD_ELEMENT_TO_CELL_LIST( this )
	}

	render() {}

	abstract contain( x: number, y: number ): void

	/**
	 * // Interaction
	 */
	/**
	 * Drag
	 */
	updateDrag( event: any, dragger: Dragger ) {}
	handleStartDrag( event: any, dragger: Dragger ) {}
	handleBeforeDragging( event: any, dragger: Dragger ) {}
	handleDragging( event: any, dragger: Dragger ) {}
	handleAfterDragging( event: any, dragger: Dragger ) {
		this.getters.draw.render()
	}
	handleStopDrag( event?: any ) {
		this.getters.draw.render()
	}

	/**
	 * Double click
	 */
	handleDoubleClick( event?: any ) {}

	/**
	 * Rotate
	 */
	rotate( angle ) {
		this.prevAngle = this.angle
		this.angle = angle
		this.draw.render()
	}

	/**
	 * Size
	 */
	size( kX: number, kY: number, center: Point2D ) {
		this.prevKX = this.kX
		this.kX = kX

		this.prevKY = this.kY
		this.kY = kY
	}

	/**
	 * Selection
	 */
	select() {
		this.shouldSelect = true
	}

	deselect() {
		this.shouldSelect = false
	}
}
