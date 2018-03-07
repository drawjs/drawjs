import EventKeyboard from "../util/EventKeyboard"
import Particle from "../model/Particle"

class Interaction extends Particle {
	eventKeyboard: EventKeyboard
	constructor( props ) {
		super( props )

		const self = this

		const canvas = self.getters.canvas

		self.eventKeyboard = new EventKeyboard()

		self.getters.canvas.removeEventListener(
			"mousewheel",
			mousewheelListener
		)
		self.getters.canvas.addEventListener( "mousewheel", mousewheelListener )
		canvas.removeEventListener( "mousedown", mousedownListener )
		canvas.addEventListener( "mousedown", mousedownListener )

		canvas.removeEventListener( "mousemove", mousemoveListener )
		canvas.addEventListener( "mousemove", mousemoveListener )

		canvas.removeEventListener( "mouseup", mouseupListener )
		canvas.addEventListener( "mouseup", mouseupListener )

		function mousedownListener( event ) {
			const point: Point2DInitial = self.getters.getInitialPoint( event )

			if ( self.getters.viewPort.isPanning ) {
				return self.getters.viewPort.startPan( event )
			}

			if ( self.getters.pointOnEmpty( point ) ) {
				self.actions.DESELECT_ALL_CELLS()
				startSelect( event )
				return
			}

			if ( self.getters.pointOnSelectionExcludingCells( point ) ) {
				self.actions.START_DRAG_MOST_TOP_CELL_FOCUSED( point )
				return
			}

			if ( self.getters.pointOnCellDeselected( point ) ) {
				self.actions.DESELECT_ALL_CELLS()

				self.actions.SELECT_MOST_TOP_CELL_FOCUSED( point )

				self.actions.START_DRAG_MOST_TOP_CELL_FOCUSED( point )
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
			self.getters.selector.shouldSelect && selecting( event )

			self.getters.viewPort.shouldPan &&
				self.getters.viewPort.panning( event )

			self.actions.DRAGGING_CELLS_SHOULD_DRAG()
		}

		function mouseupListener( event ) {
			self.getters.selector.shouldSelect = false

			stopSelect( event )

			self.actions.STOP_DRAG_CELLS_SHOULD_DRAG()

			self.getters.viewPort.stopPan()
		}

		function mousewheelListener( event ) {
			event.preventDefault()

			const { eventKeyboard } = self.getters
			const point: Point2D = self.getters.getPoint( event )
			const { deltaX, deltaY }: { deltaX: number; deltaY: number } = event

			if ( isDecreasing() && eventKeyboard.isAltPressing ) {
				self.getters.viewPort.zoomIn( point )
			}

			if ( isIncreasing() && eventKeyboard.isAltPressing ) {
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
