import getters from "../store/draw/getters"
import {
	DESELECT_ALL_CELLS,
	SELECT_MOST_TOP_CELL_FOCUSED,
	SELECT_CELLS_IN_SELECTOR_RIGION,
} from "../store/draw/actions"
import sharedGetters from "../shared/sharedGetters"
import { startDragCell, draggingCell, stopDragCell } from "../mixin/coupleCell"
import {
	startDragMostTopCellFocused,
	draggingCellsShouldDrag,
	stopDragCellsShouldDrag,
	startDragCellsShouldSelect
} from "../mixin/mixin"
import EventKeyboard from "../util/EventKeyboard"

class Interaction {
	eventKeyboard: EventKeyboard
	constructor() {
		const self = this

		const canvas = getters.canvas

		this.eventKeyboard = new EventKeyboard()

		getters.canvas.removeEventListener( "mousewheel", mousewheelListener )
		getters.canvas.addEventListener( "mousewheel", mousewheelListener )
		canvas.removeEventListener( "mousedown", mousedownListener )
		canvas.addEventListener( "mousedown", mousedownListener )

		canvas.removeEventListener( "mousemove", mousemoveListener )
		canvas.addEventListener( "mousemove", mousemoveListener )

		canvas.removeEventListener( "mouseup", mouseupListener )
		canvas.addEventListener( "mouseup", mouseupListener )

		function mousedownListener( event ) {
			const point = getters.getPoint( event )

			if ( getters.viewPort.isPanning ) {
				return getters.viewPort.startPan( event )
			}

			if ( getters.pointOnEmpty( point ) ) {
				DESELECT_ALL_CELLS()
				startSelect( event )
				return
			}

			if ( sharedGetters.pointOnSelectionExcludingCells( point ) ) {
				startDragMostTopCellFocused( point )
				return
			}

			if ( sharedGetters.pointOnCellDeselected( point ) ) {
				DESELECT_ALL_CELLS()

				SELECT_MOST_TOP_CELL_FOCUSED( point )

				startDragMostTopCellFocused( point )
				return
			}

			/**
			 * Start dragging selected cells
			 */
			if ( sharedGetters.pointOnCellSelected( point ) ) {
				startDragCellsShouldSelect( event )
				return
			}
		}

		function mousemoveListener( event ) {
			getters.selector.shouldSelect && selecting( event )

			getters.viewPort.shouldPan && getters.viewPort.panning( event )

			draggingCellsShouldDrag()
		}

		function mouseupListener( event ) {
			getters.selector.shouldSelect = false

			stopSelect( event )

			stopDragCellsShouldDrag()

			getters.viewPort.stopPan()
		}

		function mousewheelListener( event ) {
			event.preventDefault()

			const { eventKeyboard } = getters
			const point: Point2D = getters.getPoint( event )
			const { deltaX, deltaY }: { deltaX: number; deltaY: number } = event

			if ( isDecreasing() && eventKeyboard.isAltPressing ) {
				getters.viewPort.zoomIn( point )
				console.log( deltaX )
			}

			if ( isIncreasing() && eventKeyboard.isAltPressing ) {
				getters.viewPort.zoomOut( point )
			}

			function isIncreasing() {
				const res = deltaX > 0 || deltaY > 0
				return res
			}
			function isDecreasing() {
				const res = deltaX < 0 || deltaY < 0
				return res
			}
		}

		function startSelect( event ) {
			getters.selector.shouldSelect = true

			getters.selector.startPoint = getters.getPoint( event )
			getters.draw.render()
		}

		function selecting( event ) {
			getters.selector.endPoint = getters.getPoint( event )
			getters.draw.render()
		}

		function stopSelect( event ) {
			SELECT_CELLS_IN_SELECTOR_RIGION()

			getters.selector.startPoint = null
			getters.selector.endPoint = null
			getters.draw.render()
		}
	}
}

export default Interaction
