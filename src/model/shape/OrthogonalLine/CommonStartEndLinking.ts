import Segment from '../../Segment';
import OrthogonalLine from "./OrthogonalLine"
import CommonLine from "./CommonLine"
import CornerSegment from "./CornerSegment"
import { notNil } from "../../../util/lodash/index"
import Cell from '../../Cell';
import { removeElement, isFirst, isFirstElement, findArrayFirstIndex, isLastElementOf, notEmpty } from '../../../util/js/array';

export default abstract class CommonStartEndLinking extends Cell {
	orthogonalLine: OrthogonalLine
	segment: Segment

	constructor( props ) {
		super( props )

		const { segment, point } = props
		this.segment = notNil( segment ) ? segment : new Segment( { draw: this.draw, ...point, fillColor: props.segmentFillColor } )

		this.handleSegmentAfterDragging = this.handleSegmentAfterDragging.bind( this )
		this.handleSegmentStopDrag = this.handleSegmentStopDrag.bind( this )
		this.updateSegmentDrag = this.updateSegmentDrag.bind( this )


		this.orthogonalLine = props.orthogonalLine

		const { dragger } = this.segment



		dragger.interfaceStopDragList.push( this.handleSegmentStopDrag )
		dragger.interfaceDraggingList.push( this.handleSegmentAfterDragging )
		dragger.updateList.push( this.updateSegmentDrag )

	}

	abstract translateLinkingToPoint( point: Point2D )

	translateLinkingToPointWith(
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
		const { x, y } = point

		/**
		 * Update the position of sepecific corner segment
		 */

		if ( isCoincided ) {
			const secondLine = getNextLine( line )
			if ( notNil( secondLine ) ) {
				secondLine.isHorizontal &&
					this.sharedActions.updateSegmentX( corner, x )
				secondLine.isVertical && this.sharedActions.updateSegmentY( corner, y )

				if ( secondLine.isCoincided ) {
					const thirdLine = getNextLine( secondLine )
					if ( notNil( thirdLine ) ) {
						thirdLine.isVertical &&
							this.sharedActions.updateSegmentX( corner, x )
						thirdLine.isHorizontal && this.sharedActions.updateSegmentY( corner, y )

					} else {
						defaultUpdateCornerPosition()
					}
				}
			} else {
				defaultUpdateCornerPosition()
			}
		} else {
			cachedIsVertical && this.sharedActions.updateSegmentX( corner, point.x )
			cachedIsHorizontal && this.sharedActions.updateSegmentY( corner, point.y )
		}

		function defaultUpdateCornerPosition() {
			self.sharedActions.updateSegmentX( corner, x )
		}
	}

	updateSegmentDrag( event ) {
		const point: Point2DInitial = this.segment.getters.getInitialPoint( event )
		const { dragger } = this.segment
		const { updateList } = dragger
		const notEmptyUpdateList = notEmpty( updateList )

		const dx = dragger.getDeltaXToPrevPoint( point )
		const dy = dragger.getDeltaYToPrevPoint( point )


		let { x, y } = this.segment.point

		x = x + dx
		y = y + dy

		this.translateLinkingToPoint( { x, y } )

		if ( ! notEmptyUpdateList || ( notEmptyUpdateList && isLastElementOf( updateList, this.updateSegmentDrag ) ) ) {
			this.segment.translateToPoint( { x, y } )
		}
	}

	handleSegmentAfterDragging( event ) {
		!this.orthogonalLine.isSimpleLine && this.orthogonalLine.updateCenterSegmentsPosition()
	}

	abstract handleSegmentStopDrag( point: Point2D )


	contain() {

	}

	remove() {
		const { dragger } = this.segment
		removeElement( dragger.interfaceStopDragList, this.handleSegmentStopDrag  )
		removeElement( dragger.interfaceAfterDraggingList, this.handleSegmentAfterDragging  )
		super.remove()
	}

	forceRemove() {
		this.segment && this.segment.remove()
		this.remove()
	}
}
