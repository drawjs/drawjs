import * as _ from 'lodash'
import { generateUniqueId } from 'util/index'
import Draw from '../Draw'
import * as i from "interface/index"


export default class Cell {
	private id: string = generateUniqueId()
	public draw: Draw
	public _isInstance: boolean = true
	public type:string

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
}
