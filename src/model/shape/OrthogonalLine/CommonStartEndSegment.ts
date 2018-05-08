import Segment from "../../Segment"
import OrthogonalLine from "./OrthogonalLine"
import CommonLine from "./CommonLine"
import CornerSegment from "./CornerSegment"
import { notNil } from "../../../util/lodash/index"

export default abstract class CommonSegment extends Segment {
	orthogonalLine: OrthogonalLine

	constructor( props ) {
		super( props )

		this.orthogonalLine = props.orthogonalLine
	}

	translateToPointWith(
		point: Point2D,
		line: CommonLine,
		corner: CornerSegment,
		getNextLine: Function
	) {
		const self = this
		const {
			isVertical: cachedIsVertical,
			isHorizontal: cachedIsHorizontal,
			isCoincided
		} = line

		super.translateToPoint( point )

		/**
		 * Update the position of sepecific corner segment
		 */

		if ( isCoincided ) {
			const secondLine = getNextLine( line )
			if ( notNil( secondLine ) ) {
				secondLine.isHorizontal &&
					this.sharedActions.updateSegmentX( corner, this.x )
				secondLine.isVertical && this.sharedActions.updateSegmentY( corner, this.y )

				if ( secondLine.isCoincided ) {
					const thirdLine = getNextLine( secondLine )
					if ( notNil( thirdLine ) ) {
						thirdLine.isVertical &&
							this.sharedActions.updateSegmentX( corner, this.x )
						thirdLine.isHorizontal && this.sharedActions.updateSegmentY( corner, this.y )

					} else {
						defaultUpdateCornerPosition()
					}
				}
			} else {
				defaultUpdateCornerPosition()
			}
		} else {
			cachedIsVertical && this.sharedActions.updateSegmentX( corner, this.x )
			cachedIsHorizontal && this.sharedActions.updateSegmentY( corner, this.y )
		}

		function defaultUpdateCornerPosition() {
			self.sharedActions.updateSegmentX( corner, this.x )
		}
	}

	updateDrag( event ) {
		const point: Point2DInitial = this.getters.getInitialPoint( event )

		const deltaX = this.dragger.getDeltaXToPrevPoint( point )
		const deltaY = this.dragger.getDeltaYToPrevPoint( point )

		const { x, y } = this.point
		const newX = x + deltaX
		const newY = y + deltaY

		this.translateToPoint( { x: newX, y: newY } )
	}

	handleAfterDragging() {
		this.orthogonalLine.updateCenterSegmentsPosition()

		super.handleAfterDragging && super.handleAfterDragging()
	}
}
