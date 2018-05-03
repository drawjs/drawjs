import EventKeyboard from '../util/EventKeyboard';
import Particle from "../model/Particle"


const drawSelection = false

class Interaction extends Particle {
	eventKeyboard: EventKeyboard
	constructor( props ) {
		super( props )

		const self = this

		const { canvas, textInput } = self.getters

		self.eventKeyboard = new EventKeyboard()

		canvas.removeEventListener( "mousewheel", mousewheelListener )
		canvas.addEventListener( "mousewheel", mousewheelListener )

		canvas.removeEventListener( "mousedown", mousedownListener )
		canvas.addEventListener( "mousedown", mousedownListener )

		canvas.removeEventListener( "mousemove", mousemoveListener )
		canvas.addEventListener( "mousemove", mousemoveListener )

		canvas.removeEventListener( "mouseup", mouseupListener )
		canvas.addEventListener( "mouseup", mouseupListener )

		canvas.removeEventListener( "dblclick", dblclickListener )
		canvas.addEventListener( "dblclick", dblclickListener )

		textInput.bindEvents()

		self.eventKeyboard.handleKeyDown = keyBoardDownListener

		function mousedownListener( event ) {
			const point: Point2DInitial = self.getters.getInitialPoint( event )

			// if ( self.getters.viewPort.isPanning ) {
			// 	return self.getters.viewPort.startPan( event )
			// }


			if ( self.getters.pointOnEmpty( point ) ) {
				self.actions.DESELECT_ALL_CELLS()

				startSelect( event )

				! drawSelection && self.getters.viewPort.startPan( event )

				return
			}

			if ( self.getters.pointOnSelectionExcludingCells( point ) ) {
				self.actions.START_DRAG_MOST_TOP_CELL_FOCUSED( event )
				return
			}

			if ( self.getters.pointOnCellDeselected( point ) ) {
				self.actions.DESELECT_ALL_CELLS()

				self.actions.SELECT_MOST_TOP_CELL_FOCUSED( point )

				self.actions.START_DRAG_MOST_TOP_CELL_FOCUSED( event )
				return
			}

			/**
			 * Start dragging selected cells
			 */
			if ( self.getters.pointOnCellSelected( point ) ) {
				self.actions.START_DRAG_CELLS_SHOULD_SELECT( event )
				return
			}
		}

		function mousemoveListener( event ) {
			drawSelection && self.getters.selector.shouldSelect && selecting( event )

			!drawSelection && self.getters.viewPort.shouldPan &&
				self.getters.viewPort.panning( event )

			self.actions.DRAGGING_CELLS_SHOULD_DRAG( event )
		}

		function mouseupListener( event ) {
			self.getters.selector.shouldSelect = false

			stopSelect( event )

			self.actions.STOP_DRAG_CELLS_SHOULD_DRAG( event )

			self.getters.viewPort.stopPan()
		}

		function mousewheelListener( event ) {
			event.preventDefault()

			const { eventKeyboard } = self.getters
			const point: Point2D = self.getters.getPoint( event )
			const { deltaX, deltaY }: { deltaX: number; deltaY: number } = event

			// if ( isDecreasing() && eventKeyboard.isAltPressing ) {
			if ( isDecreasing() ) {
				self.getters.viewPort.zoomIn( point )
			}

			// if ( isIncreasing() && eventKeyboard.isAltPressing ) {
			if ( isIncreasing() ) {
				self.getters.viewPort.zoomOut( point )
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

		function dblclickListener( event ) {
			self.actions.DOUBLE_CLICK_MOST_TOP_CELL_FOCUSED( event )
		}

		function keyBoardDownListener( event ) {
			const { key } = event
			const { textInput } = self.getters
			if ( key === EventKeyboard.KEYBOARD_KEYS.ENTER ) {
				// Text input
				textInput.isShowing && textInput.hideSelfAndUpdateTarget()
			}
		}

		function startSelect( event ) {
			self.getters.selector.shouldSelect = true

			self.getters.selector.startPoint = self.getters.getInitialPoint(
				event
			)
			self.getters.draw.render()
		}

		function selecting( event ) {
			self.getters.selector.endPoint = self.getters.getInitialPoint( event )
			self.getters.draw.render()
		}

		function stopSelect( event ) {
			self.actions.SELECT_CELLS_IN_SELECTOR_RIGION()

			self.getters.selector.startPoint = null
			self.getters.selector.endPoint = null
			self.getters.draw.render()
		}
	}

}

export default Interaction
