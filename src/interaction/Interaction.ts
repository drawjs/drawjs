import * as _ from 'lodash'

import { Cell, SelectionArea } from 'model/index'
import * as interfaces from 'interface/index'
import Draw from '../Draw'


export default class Interaction {
	private draw: Draw
	private _isDragging: boolean = false
	private _selectionAreaInstance: SelectionArea
	private _shouldDrawSelectionArea: boolean = false

	/**
	 * should drag all selected elements instances
	 */
	private _shouldDragAllSelected: boolean = false

	constructor( draw: Draw ) {
		this.draw = draw
		this._selectionAreaInstance = new SelectionArea( { draw: draw } )
	}

	get elementInstancesSelectedBySelectionArea(): interfaces.DrawStoreElementInstance[] {
		const self = this
		const selementInstances = this.draw.__storeActiveElementsInstances__.filter( isElementInstanceSelectedBySelectionArea )

		function isElementInstanceSelectedBySelectionArea( { left, top, width, height } ): boolean {
			return self._selectionAreaInstance.isRectInSelectionArea( { left, top, width, height } )
		}

		return selementInstances
	}

	get __storeSelectedActiveElementsInstances__(): interfaces.DrawStoreElementInstance[] {
		return this.draw.__storeActiveElementsInstances__
			.filter( isSelected )

		function isSelected( elementInstance ) {
			return elementInstance[ 'isSelected' ] === true
		}
	}


	public initialize(): void {
		this.draw.canvas.removeEventListener( 'mousedown', this._mousedownListener )
		this.draw.canvas.addEventListener( 'mousedown', this._mousedownListener )

		this.draw.canvas.removeEventListener( 'mousemove', this._mousemoveListener )
		this.draw.canvas.addEventListener( 'mousemove', this._mousemoveListener )

		this.draw.canvas.removeEventListener( 'mouseup', this._mouseupListener )
		this.draw.canvas.addEventListener( 'mouseup', this._mouseupListener )

		this.draw.canvas.removeEventListener( 'click', this._clickListener )
		this.draw.canvas.addEventListener( 'click', this._clickListener )
	}

	public disableInteraction(): void {
		this._mousedownListener = null
		this.draw.canvas.removeEventListener( 'mousedown', this._mousedownListener )
		this.draw.canvas.removeEventListener( 'mousemove', this._mousemoveListener )
		this.draw.canvas.removeEventListener( 'mouseup', this._mouseupListener )
		this.draw.canvas.removeEventListener( 'click', this._clickListener )
	}


	public render(): void {
		this._selectionAreaInstance.render( this.draw.ctx )
	}



	private _mousedownListener = ( event ): void => {
		this._onDragStart( event )
	}

	private _mousemoveListener = ( event ): void => {
		this._isDragging && this._onDragging( event )

		this._onHover( event )
	}

	private _mouseupListener = ( event ): void => {
		this._onDragStop( event )
	}

	private _clickListener = ( event ): void => {
		this._onClick( event )
	}

	private _onClick( event ): void {
		const topElementInstance: interfaces.DrawStoreElementInstance = this._getTopElementInstance( event )
		if ( ! _.isNil( topElementInstance ) ) {
			this.draw.onGraphClick && this.draw.onGraphClick( event, topElementInstance )
		}
	}

	private _onHover( event ) {
		const topElementInstance: interfaces.DrawStoreElementInstance = this._getTopElementInstance( event )
		if ( ! _.isNil( topElementInstance ) ) {
			this.draw.onGraphHover && this.draw.onGraphHover( event, topElementInstance )
		}
	}

	private _onDragStart( event ): void {
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

		this.draw.render()
	}

	private _onDragging( event ): void {
		// ****** select  ******/
		this._shouldDrawSelectionArea && this._selectionAreaInstance.drawing( event )
		// ****** select  ******/

		// ****** drag selected elements instances  ******/
		this._shouldDragAllSelected && this._draggingSelectedElementInstances( event )
		// ****** drag selected elements instances  ******/

		this.draw.render()
	}

	private _onDragStop( event ): void {
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

		this.draw.render()
	}



	private _getTopElementInstance( event ): interfaces.DrawStoreElementInstance {
		const self = this
		const elementInstancesContainPoint = this._getElementInstancesContainPoint( event.x - this.draw.canvasLeft, event.y  - this.draw.canvasTop )

		if ( elementInstancesContainPoint.length > 0 ) {
			return elementInstancesContainPoint[ elementInstancesContainPoint.length - 1 ]
		}

		return null
	}

	private _getElementInstancesContainPoint( x: number, y: number ): interfaces.DrawStoreElementInstance[] {
		function isContainPoint( elementInstance ) {
			return elementInstance.containPoint && elementInstance.containPoint( x, y )
		}

		return this.draw.__storeActiveElementsInstances__.filter( isContainPoint )
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
		const self = this
		this.__storeSelectedActiveElementsInstances__.map( resolve )

		function resolve( elementInstance ) {
			elementInstance._startDrag && elementInstance._startDrag( event )
			// elementInstance.deltaDragStartPointToLeftSideX = event.x - self.draw.canvasLeft  - elementInstance.left
			// elementInstance.deltaDragStartPointToTopSideY = event.y  - self.draw.canvasTop - elementInstance.top
		}
	}
	private _draggingSelectedElementInstances( event ) {
		const self = this
		this.__storeSelectedActiveElementsInstances__.map( resolve )

		function resolve( elementInstance ) {
			elementInstance._dragging && elementInstance._dragging( event )

			// if ( ! _.isNil( elementInstance.deltaDragStartPointToLeftSideX ) ) {
			// 	elementInstance.left = event.x - self.draw.canvasLeft - elementInstance.deltaDragStartPointToLeftSideX
			// }
			// if ( ! _.isNil( elementInstance.deltaDragStartPointToTopSideY ) ) {
			// 	elementInstance.top = event.y  - self.draw.canvasTop - elementInstance.deltaDragStartPointToTopSideY
			// }
		}
	}
	private _stopDragSelectedElementInstances( event ) {
		this.__storeSelectedActiveElementsInstances__.map( resolve )

		function resolve( elementInstance ) {
			elementInstance._stopDrag && elementInstance._stopDrag( event )
			// elementInstance.deltaDragStartPointToLeftSideX = null
			// elementInstance.deltaDragStartPointToTopSideY = null
		}
	}
	// ****** drag selected elements instances  ******/
}
