import getters from "store/draw/getters"
import { cloneDeep } from "lodash"

class Dragger {
	enable: boolean
	prevPoint: Point2D

	updatePrevPoint( point: Point2D ) {
		this.prevPoint = cloneDeep( point )
	}
	update( event ) {}
	start( event ): void {
		const point: Point2D = getters.getInitialPoint( event )

		this.enable = true

		this.updatePrevPoint( point )

		this.handleStart && this.handleStart( event )
	}
	dragging( event ): void {
		const point: Point2D = getters.getInitialPoint( event )

		this.update( event )

		this.updatePrevPoint( point )

		this.handleDragging && this.handleDragging( event )
	}
	stop( event ): void {
		this.enable = false
		this.handleStop && this.handleStop( event )
	}
	handleStart( event ) {}
	handleDragging( event ) {}
	handleStop( event ) {}

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
}

export default Dragger
