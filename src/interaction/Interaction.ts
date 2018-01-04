import * as _ from 'lodash'

import { Cell, SelectionArea } from 'model/index'
import * as interfaces from 'interface/index'


export default class Interaction {
	private _draw: any
	private _isDragging: boolean = false
	private _selectionAreaInstance: SelectionArea = new SelectionArea( {} )

	constructor( draw: any ) {
		this._draw = draw
	}

	public render(): void {
		this._selectionAreaInstance.render( this._draw.ctx )
	}

	private _mousedownListener = ( event ): void => {
		this.onDragStart( event )
	}

	private _mousemoveListener = ( event ): void => {
		this._isDragging && this.onDragging( event )
	}

	private _mouseupListener = ( event ): void => {
		this.onDragStop( event )
	}

	private onDragStart( event ): void {
		this._isDragging = true

		if ( this._isPointOnAnyElementInstanceWhenActivateEvent( event ) ) {
			const topElementInstance: interfaces.DrawStoreElementInstance = this._getTopElementInstanceWhenActivateEvent( event )
			this.toogleSelectElementInstance( topElementInstance )
		}

		if ( this._isPointOnEmptyArea( event ) ) {
			this.unselectAllSelectedElementInstances()

			this._drawSelectionAreaStart( event )
		}

		this._draw.render()

		this._selectionAreaInstance.isDrawing = true
	}

	private onDragging( event ): void {
		this._selectionAreaInstance.isDrawing && this._drawSelectionAreaEnd( event )
	}

	private onDragStop( event ): void {
		this._isDragging = false
		this._selectionAreaInstance.isDrawing = false
	}

	private _getTopElementInstanceWhenActivateEvent( event ): interfaces.DrawStoreElementInstance {
		const self = this
		const elementInstancesContainPoint = getElementInstancesContainPoint( event )

		if ( elementInstancesContainPoint.length > 0 ) {
			return elementInstancesContainPoint[ elementInstancesContainPoint.length - 1 ]
		}

		function getElementInstancesContainPoint( event: any ) {
			const x = event.x
			const y = event.y

			function isContainPoint( elementInstance ) {
				return elementInstance.containPoint( x, y )
			}

			return self._draw.__storeActiveElementsInstances__.filter( isContainPoint )
		}

		return null
	}

	private _isPointOnAnyElementInstanceWhenActivateEvent( event ): boolean {
		const topElementInstance: interfaces.DrawStoreElementInstance = this._getTopElementInstanceWhenActivateEvent( event )
		return ! _.isNil( topElementInstance )
	}

	private _isPointOnEmptyArea( event ): boolean {
		return ! this._isPointOnAnyElementInstanceWhenActivateEvent( event )
	}


	// ****** selection ******
	public enableSelect(): void {
		this._draw.canvas.removeEventListener( 'mousedown', this._mousedownListener )
		this._draw.canvas.addEventListener( 'mousedown', this._mousedownListener )

		this._draw.canvas.removeEventListener( 'mousemove', this._mousemoveListener )
		this._draw.canvas.addEventListener( 'mousemove', this._mousemoveListener )

		this._draw.canvas.removeEventListener( 'mouseup', this._mouseupListener )
		this._draw.canvas.addEventListener( 'mouseup', this._mouseupListener )
	}

	public disableSelect(): void {
		this._mousedownListener = null
		this._draw.canvas.removeEventListener( 'mousedown', this._mousedownListener )
		this._draw.canvas.removeEventListener( 'mousemove', this._mousemoveListener )
		this._draw.canvas.removeEventListener( 'mouseup', this._mouseupListener )
	}


	public unselectElementInstance( elementInstance ): void {
		elementInstance[ 'isSelected' ] = false
	}

	public selectElementInstance( elementInstance ): void {
		elementInstance[ 'isSelected' ] = true
	}

	public toogleSelectElementInstance( elementInstance ): void {
		elementInstance[ 'isSelected' ] = ! elementInstance[ 'isSelected' ]
	}

	public unselectAllSelectedElementInstances(): void {
		this._draw.__storeActiveElementsInstances__
			.filter( isSelected )
			.map( this.unselectElementInstance )

		function isSelected( elementInstance ) {
			return elementInstance[ 'isSelected' ] === true
		}
	}


	private _drawSelectionAreaStart( event ): void {
		this._selectionAreaInstance.startPoint = {
			x: event.x,
			y: event.y,
		}
		this._draw.render()
	}
	private _drawSelectionAreaEnd( event ): void {
		this._selectionAreaInstance.endPoint = {
			x: event.x,
			y: event.y,
		}
		this._draw.render()
	}
	// ****** selection ******
}
