import * as _ from 'lodash'

import { Cell, SelectionArea } from 'model/index'
import * as interfaces from 'interface/index'


export default class Interaction {
	private _draw: any
	private _isDragging: boolean = false
	private _selectionAreaInstance: SelectionArea
	private _shouldDrawSelectionArea: boolean = false

	/**
	 * should drag all selected elements instances
	 */
	private _shouldDragAllSelected: boolean = false

	constructor( draw: any ) {
		this._draw = draw
		this._selectionAreaInstance = new SelectionArea( { draw: draw } )
	}

	get elementInstancesSelectedBySelectionArea(): interfaces.DrawStoreElementInstance[] {
		const self = this
		const selementInstances = this._draw.__storeActiveElementsInstances__.filter( isElementInstanceSelectedBySelectionArea )

		function isElementInstanceSelectedBySelectionArea( { left, top, width, height } ): boolean {
			return self._selectionAreaInstance.isRectInSelectionArea( { left, top, width, height } )
		}

		return selementInstances
	}

	get __storeSelectedActiveElementsInstances__(): interfaces.DrawStoreElementInstance[] {
		return this._draw.__storeActiveElementsInstances__
			.filter( isSelected )

		function isSelected( elementInstance ) {
			return elementInstance[ 'isSelected' ] === true
		}
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

		if ( this._isPointOnAnySelectedElementInstance( event ) ) {
			// ****** drag selected elements instances  ******/
			this._shouldDragAllSelected = true
			this._startDragSelectedElementInstances( event )
			// ****** drag selected elements instances  ******/

		}

		if ( this._isPointOnAnyUnselectedElementInstance( event ) ) {
			// ****** select  ******/
			this._unselectAllSelectedElementInstances()

			const topElementInstance: interfaces.DrawStoreElementInstance = this._getTopElementInstance( event )
			this._selectElementInstance( topElementInstance )
			// ****** select  ******/

			// ****** drag selected elements instances  ******/
			this._shouldDragAllSelected = true
			this._startDragSelectedElementInstances( event )
			// ****** drag selected elements instances  ******/
		}

		if ( this._isPointOnEmptyArea( event ) ) {
			// ****** select  ******/
			this._shouldDrawSelectionArea = true

			this._unselectAllSelectedElementInstances()
			this._selectionAreaInstance.startDraw( event )
			// ****** select  ******/
		}

		this._draw.render()
	}

	private onDragging( event ): void {
		// ****** select  ******/
		this._shouldDrawSelectionArea && this._selectionAreaInstance.drawing( event )
		// ****** select  ******/

		// ****** drag selected elements instances  ******/
		this._shouldDragAllSelected && this._draggingSelectedElementInstances( event )
		// ****** drag selected elements instances  ******/

		this._draw.render()
	}

	private onDragStop( event ): void {
		this._isDragging = false

		// ****** select  ******/
		this._shouldDrawSelectionArea && this._selectAllElementInstancesSelectedBySelectionArea()
		this._shouldDrawSelectionArea && this._selectionAreaInstance.stopDraw( event )

		this._shouldDrawSelectionArea = false
		// ****** select  ******/

		// ****** select  ******/

		// ****** drag selected elements instances  ******/
		this._shouldDragAllSelected && this._stopDragSelectedElementInstances( event )
		this._shouldDragAllSelected = false
		// ****** drag selected elements instances  ******/

		this._draw.render()
	}

	private _getTopElementInstance( event ): interfaces.DrawStoreElementInstance {
		const self = this
		const elementInstancesContainPoint = this._getElementInstancesContainPoint( event.x, event.y )

		if ( elementInstancesContainPoint.length > 0 ) {
			return elementInstancesContainPoint[ elementInstancesContainPoint.length - 1 ]
		}

		return null
	}

	private _getElementInstancesContainPoint( x: number, y: number ): interfaces.DrawStoreElementInstance[] {
		function isContainPoint( elementInstance ) {
			return elementInstance.containPoint( x, y )
		}

		return this._draw.__storeActiveElementsInstances__.filter( isContainPoint )
	}

	private _isPointOnAnyElementInstance( event ): boolean {
		const topElementInstance: interfaces.DrawStoreElementInstance = this._getTopElementInstance( event )
		return ! _.isNil( topElementInstance )
	}

	private _isPointOnAnySelectedElementInstance( event ): boolean {
		const topElementInstance: interfaces.DrawStoreElementInstance = this._getTopElementInstance( event )
		const isInSelectedElementsInstances = _.includes( this.__storeSelectedActiveElementsInstances__, topElementInstance )
		return ! _.isNil( topElementInstance ) && isInSelectedElementsInstances
	}

	private _isPointOnAnyUnselectedElementInstance( event ): boolean {
		const topElementInstance: interfaces.DrawStoreElementInstance = this._getTopElementInstance( event )
		const isNotInSelectedElementsInstances = ! _.includes( this.__storeSelectedActiveElementsInstances__, topElementInstance )
		return ! _.isNil( topElementInstance ) && isNotInSelectedElementsInstances
	}

	private _isPointOnEmptyArea( event ): boolean {
		return ! this._isPointOnAnyElementInstance( event )
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


	private _unselectElementInstance( elementInstance: interfaces.DrawStoreElementInstance ): void {
		elementInstance[ 'isSelected' ] = false
	}

	private _selectElementInstance( elementInstance: interfaces.DrawStoreElementInstance ): void {
		elementInstance[ 'isSelected' ] = true
	}

	private _toogleSelectElementInstance( elementInstance: interfaces.DrawStoreElementInstance ): void {
		elementInstance[ 'isSelected' ] = ! elementInstance[ 'isSelected' ]
	}

	private _unselectAllSelectedElementInstances(): void {
		this.__storeSelectedActiveElementsInstances__
			.map( this._unselectElementInstance )

		function isSelected( elementInstance ) {
			return elementInstance[ 'isSelected' ] === true
		}
	}


	private _selectAllElementInstancesSelectedBySelectionArea(): void {
		this._unselectAllSelectedElementInstances()
		this.elementInstancesSelectedBySelectionArea.map( this._selectElementInstance )
	}
	// ****** selection ******

	// ****** drag selected elements instances  ******/
	private _startDragSelectedElementInstances( event ) {
		this.__storeSelectedActiveElementsInstances__.map( resolve )

		function resolve( elementInstance ) {
			elementInstance.deltaDragStartPointToLeftSideX = event.x - elementInstance.left
			elementInstance.deltaDragStartPointToTopSideY = event.y - elementInstance.top

			// console.log( {
			// 	deltaDragStartPointToLeftSideX: elementInstance.deltaDragStartPointToLeftSideX,
			// 	'event.x': event.x,
			// 	'elementInstance.left': elementInstance.left,
			// } )
		}
	}
	private _draggingSelectedElementInstances( event ) {
		this.__storeSelectedActiveElementsInstances__.map( resolve )

		function resolve( elementInstance ) {
			if ( ! _.isNil( elementInstance.deltaDragStartPointToLeftSideX ) ) {
				elementInstance.left = event.x - elementInstance.deltaDragStartPointToLeftSideX
			}
			if ( ! _.isNil( elementInstance.deltaDragStartPointToTopSideY ) ) {
				elementInstance.top = event.y - elementInstance.deltaDragStartPointToTopSideY
			}
		}
	}
	private _stopDragSelectedElementInstances( event ) {
		this.__storeSelectedActiveElementsInstances__.map( resolve )

		function resolve( elementInstance ) {
			elementInstance.deltaDragStartPointToLeftSideX = null
			elementInstance.deltaDragStartPointToTopSideY = null
		}
	}
	// ****** drag selected elements instances  ******/
}
