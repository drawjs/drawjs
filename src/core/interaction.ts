import EventKeyboard from "../util/EventKeyboard"
import Particle from "../model/Particle"
import { notNil } from "../util/lodash/index"
import { isMiddleClick } from "../drawUtil/model/interaction/index"

const drawSelection = false

export default class Interaction extends Particle {
	eventKeyboard: EventKeyboard

	prevHovingDsElement: any

	interfaceOnEmptyClick: Function

	constructor( props ) {
		super( props )

		const { canvas, textInput } = this.getters

		this.eventKeyboard = new EventKeyboard()

		canvas.removeEventListener(
			"mousedown",
			this.mousedownListener.bind( this )
		)
		canvas.addEventListener( "mousedown", this.mousedownListener.bind( this ) )

		canvas.removeEventListener(
			"mousemove",
			this.mousemoveListener.bind( this )
		)
		canvas.addEventListener( "mousemove", this.mousemoveListener.bind( this ) )

		canvas.removeEventListener( "mouseup", this.mouseupListener.bind( this ) )
		canvas.addEventListener( "mouseup", this.mouseupListener.bind( this ) )

		canvas.removeEventListener( "click", this.clickListener.bind( this ) )
		canvas.addEventListener( "click", this.clickListener.bind( this ) )

		canvas.removeEventListener( "dblclick", this.dblclickListener.bind( this ) )
		canvas.addEventListener( "dblclick", this.dblclickListener.bind( this ) )

		canvas.removeEventListener( "contextmenu", this.contextmenuListener.bind( this ) )
		canvas.addEventListener( "contextmenu", this.contextmenuListener.bind( this ) )

		canvas.removeEventListener(
			"mousewheel",
			this.mousewheelListener.bind( this )
		)
		canvas.addEventListener(
			"mousewheel",
			this.mousewheelListener.bind( this )
		)

		notNil( textInput ) && textInput.bindEvents()

		this.eventKeyboard.handleKeyDown = this.keyBoardDownListener.bind( this )
	}

	updatePrevHovingDsElement( dsElement ) {
		this.prevHovingDsElement = dsElement
	}

	mousedownListener( event ) {
		const { getters, actions } = this

		const point: Point2DInitial = getters.getInitialPoint( event )

		if ( this.eventKeyboard.isSpacePressing || isMiddleClick( event ) ) {
			return getters.viewPort.startPan( event )
		}

		if ( getters.pointOnEmpty( point ) ) {
			actions.DESELECT_ALL_CELLS()

			this.interfaceOnEmptyClick && this.interfaceOnEmptyClick( event )

			this.startSelect( event )

			return
		}

		if ( getters.pointOnSelectionExcludingCells( point ) ) {
			actions.START_DRAG_MOST_TOP_CELL_FOCUSED( event )
			return
		}

		if ( getters.pointOnCellDeselected( point ) ) {
			actions.DESELECT_ALL_CELLS()

			actions.SELECT_MOST_TOP_CELL_FOCUSED( point )

			actions.START_DRAG_MOST_TOP_CELL_FOCUSED( event )
			return
		}

		if ( getters.pointOnCellSelected( point ) ) {
			actions.START_DRAG_CELLS_SHOULD_SELECT( event )
			return
		}

		getters.draw.render()
	}

	mousemoveListener( event ) {
		const { getters } = this

		!getters.viewPort.shouldPan &&
			getters.selector.shouldSelect &&
			this.selecting( event )

		getters.viewPort.shouldPan && getters.viewPort.panning( event )

		this.actions.DRAGGING_CELLS_SHOULD_DRAG( event )

		this.actions.HOVER_MOST_TOP_CELL_FOCUSED( event, this )

		getters.draw.render()
	}

	mouseupListener( event ) {
		const { getters, actions } = this

		getters.selector.shouldSelect = false

		this.stopSelect( event )

		actions.STOP_DRAG_CELLS_SHOULD_DRAG( event )

		this.actions.MOUSE_UP_TOP_CELL_FOCUSED( event )

		getters.viewPort.stopPan()

		getters.draw.render()
	}

	mousewheelListener( event ) {
		const { getters } = this

		event.preventDefault()

		const { eventKeyboard } = getters
		const point: Point2D = getters.getPoint( event )
		const { deltaX, deltaY }: { deltaX: number; deltaY: number } = event

		// if ( isDecreasing() && eventKeyboard.isAltPressing ) {
		if ( isDecreasing() ) {
			getters.viewPort.zoomIn( point )
		}

		// if ( isIncreasing() && eventKeyboard.isAltPressing ) {
		if ( isIncreasing() ) {
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

	clickListener( event ) {
		this.actions.CLICK_MOST_TOP_CELL_FOCUSED( event )
	}

	dblclickListener( event ) {
		this.actions.DOUBLE_CLICK_MOST_TOP_CELL_FOCUSED( event )
	}

	contextmenuListener( event ) {
		event.preventDefault()
	}

	keyBoardDownListener( event ) {
		const { key } = event
		const { textInput } = this.getters
		if ( key === EventKeyboard.KEYBOARD_KEYS.ENTER ) {
			// Text input
			textInput.isShowing && textInput.hideSelfAndUpdateTarget()
		}
	}

	startSelect( event ) {
		const { getters } = this
		getters.selector.shouldSelect = true

		getters.selector.startPoint = getters.getInitialPoint( event )
	}

	selecting( event ) {
		const { getters } = this

		getters.selector.endPoint = getters.getInitialPoint( event )
	}

	stopSelect( event ) {
		const { getters, actions } = this
		actions.SELECT_CELLS_IN_SELECTOR_RIGION()

		getters.selector.startPoint = null
		getters.selector.endPoint = null
	}
}
