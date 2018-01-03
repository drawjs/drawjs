import * as _ from 'lodash'

import 'lib/event.js'
import * as interfaces from 'interface/index'

export default class Interaction {
	private _draw: any

	constructor( draw: any ) {
		this._draw = draw
	}


	private _mousedownListener = ( event, eventInfo ): void => {
		const isPointOnAnyElementInstanceWhenActivateEvent = this._isPointOnAnyElementInstanceWhenActivateEvent( event, eventInfo )

		if ( isPointOnAnyElementInstanceWhenActivateEvent ) {
			const topElementInstance: interfaces.DrawStoreElementInstance = this._getTopElementInstanceWhenActivateEvent( event, eventInfo )
			this.toogleSelectElementInstance( topElementInstance )
		}

		if ( ! isPointOnAnyElementInstanceWhenActivateEvent ) {
			this.cleanSelectedElementInstances()
		}

		this._draw.render()
	}

	private _getTopElementInstanceWhenActivateEvent( event, eventInfo ): interfaces.DrawStoreElementInstance {
		const self = this
		const elementInstancesContainPoint = getElementInstancesContainPoint( event, eventInfo )

		if ( elementInstancesContainPoint.length > 0 ) {
			return elementInstancesContainPoint[ elementInstancesContainPoint.length - 1 ]
		}

		function getElementInstancesContainPoint( event: any, eventInfo:any = {} ) {
			const x = event.x
			const y = event.y

			function isContainPoint( elementInstance ) {
				return elementInstance.containPoint( x, y )
			}

			return self._draw.__storeActiveElementsInstances__.filter( isContainPoint )
		}

		return null
	}

	private _isPointOnAnyElementInstanceWhenActivateEvent( event, eventInfo ): boolean {
		const topElementInstance: interfaces.DrawStoreElementInstance = this._getTopElementInstanceWhenActivateEvent( event, eventInfo )
		return ! _.isNil( topElementInstance )
	}


	// ****** selection ******
	public unselectElementInstance( elementInstance ): void {
		elementInstance[ 'isSelected' ] = false
	}

	public selectElementInstance( elementInstance ): void {
		elementInstance[ 'isSelected' ] = true
	}

	public toogleSelectElementInstance( elementInstance ): void {
		const isSelected: boolean = elementInstance[ 'isSelected' ]
		if ( isSelected ) {
			return this.unselectElementInstance( elementInstance )
		}
		if ( ! isSelected ) {
			return this.selectElementInstance( elementInstance )
		}
	}

	public cleanSelectedElementInstances(): void {
		this._draw.__storeActiveElementsInstances__
			.filter( isSelected )
			.map( this.unselectElementInstance )

		function isSelected( elementInstance ) {
			return elementInstance[ 'isSelected' ] === true
		}
	}

	public enableSelect(): void {
		this._draw.canvas.removeEventListener( 'mousedown', this._mousedownListener )
		this._draw.canvas.addEventListener( 'mousedown', this._mousedownListener )
		// eventjs.remove( this._draw.canvas, 'click', this._mousedownListener )
		// eventjs.add( this._draw.canvas, 'click', this._mousedownListener )
	}

	public disableSelect(): void {
		this._mousedownListener = null
		// eventjs.remove( this._draw.canvas, 'click', this._mousedownListener )
		this._draw.canvas.removeEventListener( 'mousedown', this._mousedownListener )
	}
	// ****** selection ******
}
