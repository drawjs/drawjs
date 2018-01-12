import * as _ from 'lodash'
import { generateUniqueId } from 'util/index'
import Draw from '../Draw'
import * as i from "interface/index"


export default class Cell {
	private id: string = generateUniqueId()
	public draw: Draw
	public _isInstance: boolean = true
	public type:string

	public DEGREE_TO_RADIAN: number = Math.PI / 180
	public RADIAN_TO_DEGREE: number = 180 / Math.PI


	/**
	 * drag
	 */
	public _prevDraggingPoint: i.Point

	constructor() {

	}

	private set(  field: string, value: any  ) {
		this[ field ] = value
	}

	public render( ctx: CanvasRenderingContext2D ) {

	}

	// ******* Drag ******
	public _updatePrevDraggingPoint( event ) {
		this._prevDraggingPoint = {
			x: event.x,
			y: event.y,
		}
	}
	public _updateDrag( event ) {
	}
	public _startDrag( event ): void {
		this._updatePrevDraggingPoint( event )
	}
	public _dragging( event ): void {
		this._updateDrag( event )
	}
	public _stopDrag( event ): void {
		this._updateDrag( event )
	}
	// ******* Drag ******

	// ******* Transform ******
	public rotatePoint( point: i.Point, angle: number, centerPoint: i.Point = { x: 0, y: 0 }) {
		if ( angle === 0 ) {
			return point
		}

		let resPoint: i.Point = _.cloneDeep( point )
		const radianAngle = angle * this.DEGREE_TO_RADIAN

		const relativePoint = {
			x: resPoint.x - centerPoint.x,
			y: resPoint.y - centerPoint.y,
		}

		resPoint = {
			x: relativePoint.x * Math.cos( radianAngle ) - relativePoint.y * Math.sin( radianAngle ),
            y: relativePoint.x * Math.sin( radianAngle ) + relativePoint.y * Math.cos( radianAngle )
		}

		return resPoint
	}
	// ******* Transform ******
}
