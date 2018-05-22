import Particle from "../Particle"
import Cell from '../../model/Cell';

class Dragger extends Particle {
	target: Cell
	enable: boolean
	prevEvent: any
	startEvent: any

	/**
	 * Drag interface
	 */
	interfaceStartDrag: Function
	interfaceBeforeDragging: Function
	interfaceDragging: Function
	interfaceAfterDragging: Function
	interfaceStopDrag: Function

	constructor( props ) {
		super( props )

		this.target = props.target
	}

	get prevPoint(): Point2DInitial {
		const point: Point2DInitial = this.getters.getInitialPoint( this.prevEvent )
		return point
	}


	getDeltaPointToPrevPoint( point ): Point2D {
		const { x, y }: Point2D = point
		const { x: prevX, y: prevY } = this.prevPoint

		const deltaPoint: Point2D = {
			x: x - prevX,
			y: y - prevY
		}
		return deltaPoint
	}

	getDeltaXToPrevPoint( point ): number {
		const deltaPoint: Point2D = this.getDeltaPointToPrevPoint( point )
		return deltaPoint.x
	}


	getDeltaYToPrevPoint( point ): number {
		const deltaPoint: Point2D = this.getDeltaPointToPrevPoint( point )
		return deltaPoint.y
	}

	get startPoint(): Point2DInitial {
		const point: Point2DInitial = this.getters.getInitialPoint( this.startEvent )
		return point
	}

	getDeltaPointToStartPoint( point ): Point2D {
		const { x, y }: Point2D = point
		const { x: startX, y: startY } = this.startPoint

		const deltaPoint: Point2D = {
			x: x - startX,
			y: y - startY
		}
		return deltaPoint
	}

	getDeltaXToStartPoint( point ): number {
		const deltaPoint: Point2D = this.getDeltaPointToStartPoint( point )
		return deltaPoint.x
	}

	getDeltaYToStartPoint( point ): number {
		const deltaPoint: Point2D = this.getDeltaPointToStartPoint( point )
		return deltaPoint.y
	}

	updatePrevEvent( event ) {
		this.prevEvent = event
	}

	updateStartEvent( event ) {
		this.startEvent = event
	}

	update( event ) {}

	start( event ): void {
		const point: Point2D = this.getters.getInitialPoint( event )

		this.enable = true

		this.updatePrevEvent( event )
		this.updateStartEvent( event )

		this.interfaceStartDrag && this.interfaceStartDrag( event, this )
		this.handleStart && this.handleStart( event )
	}
	dragging( event ): void {
		this.handleBeforeDragging && this.handleBeforeDragging( event )

		this.interfaceBeforeDragging && this.interfaceBeforeDragging( event )

		const point: Point2D = this.getters.getInitialPoint( event )

		this.update( event )

		this.interfaceDragging && this.interfaceDragging( event, this )

		this.handleDragging && this.handleDragging( event )

		this.updatePrevEvent( event )

		this.handleAfterDragging && this.handleAfterDragging( event )

		this.interfaceAfterDragging && this.interfaceAfterDragging( event )
	}
	stop( event ): void {
		this.enable = false

		this.interfaceStopDrag && this.interfaceStopDrag( event, this )

		this.handleStop && this.handleStop( event )
	}
	handleStart( event ) {}
	handleBeforeDragging( event ) {

	}
	handleDragging( event ) {}
	handleAfterDragging( event ) {

	}
	handleStop( event ) {}


}

export default Dragger
