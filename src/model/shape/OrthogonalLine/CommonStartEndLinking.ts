import Segment from '../../Segment';
import OrthogonalLine from "./OrthogonalLine"
import CommonLine from "./CommonLine"
import CornerSegment from "./CornerSegment"
import { notNil } from "../../../util/lodash/index"
import Cell from '../../Cell';

export default abstract class CommonStartEndLinking extends Cell {
	orthogonalLine: OrthogonalLine
	segment: Segment

	constructor( props ) {
		super( props )

		this.orthogonalLine = props.orthogonalLine
	}

	abstract translateToPoint( point: Point2D )

	translateToPointWith(
		point: Point2D,
		line: CommonLine,
		corner: CornerSegment,
		getNextLine: Function
	) {
		if( this.orthogonalLine.isSimpleLine ) {
			this.segment.translateToPoint( point )
			return
		}

		const self = this
		const {
			isVertical: cachedIsVertical,
			isHorizontal: cachedIsHorizontal,
			isCoincided
		} = line

		this.segment.translateToPoint( point )

		/**
		 * Update the position of sepecific corner segment
		 */

		if ( isCoincided ) {
			const secondLine = getNextLine( line )
			if ( notNil( secondLine ) ) {
				secondLine.isHorizontal &&
					this.sharedActions.updateSegmentX( corner, this.segment.x )
				secondLine.isVertical && this.sharedActions.updateSegmentY( corner, this.segment.y )

				if ( secondLine.isCoincided ) {
					const thirdLine = getNextLine( secondLine )
					if ( notNil( thirdLine ) ) {
						thirdLine.isVertical &&
							this.sharedActions.updateSegmentX( corner, this.segment.x )
						thirdLine.isHorizontal && this.sharedActions.updateSegmentY( corner, this.segment.y )

					} else {
						defaultUpdateCornerPosition()
					}
				}
			} else {
				defaultUpdateCornerPosition()
			}
		} else {
			cachedIsVertical && this.sharedActions.updateSegmentX( corner, this.segment.x )
			cachedIsHorizontal && this.sharedActions.updateSegmentY( corner, this.segment.y )
		}

		function defaultUpdateCornerPosition() {
			self.sharedActions.updateSegmentX( corner, this.segment.x )
		}
	}

	// updateDrag( event ) {
		// const point: Point2DInitial = this.getters.getInitialPoint( event )

		// const dx = this.dragger.getDeltaXToPrevPoint( point )
		// const dy = this.dragger.getDeltaYToPrevPoint( point )

	// 	this.segment.translate( dx, dy )
	// }

	handleSegmentAfterDragging( event ) {
		const point: Point2DInitial = this.getters.getInitialPoint( event )

		const dx = this.dragger.getDeltaXToPrevPoint( point )
		const dy = this.dragger.getDeltaYToPrevPoint( point )

		this.segment.translate( -dx, -dy )

		this.translateToPoint( point )

		!this.orthogonalLine.isSimpleLine && this.orthogonalLine.updateCenterSegmentsPosition()
	}

	contain() {

	}

	forceRemove() {
		this.segment && this.segment.remove()
		this.remove()
	}
}
