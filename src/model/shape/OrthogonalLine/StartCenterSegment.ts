import Segment from "../../Segment"
import OrthogonalLine from './OrthogonalLine';
import CommonCenterSegment from './CommonCenterSegment';
import StartLine from './StartLine';
import { firstElement } from '../../../util/js/array';
import CornerSegment from './CornerSegment';
import { notNil } from '../../../util/lodash/index';

const { abs } = Math
export default class StartCenterSegment extends CommonCenterSegment {
	tmpStartLine: StartLine = null

	shouldAddCornerSegmentWhenMoving: boolean = false

	constructor( props ) {
		super( props )
	}

	_removeTmpStartLine() {
		if ( notNil( this.tmpStartLine ) ) {
			this.actions.REMOVE_ELEMENT( this.tmpStartLine.centerSegment )
			this.actions.REMOVE_ELEMENT( this.tmpStartLine )
			this.tmpStartLine = null
		}
	}

	_updateTmpStartLineCenterSegmentsPosition() {
		this.tmpStartLine.updateCenterSegmentPosition()
	}


	handleAfterDragging( event ) {
		super.handleAfterDragging && super.handleAfterDragging( event )

		const point: Point2DInitial = this.getters.getInitialPoint( event )

		const dx = this.dragger.getDeltaXToStartPoint( point )
		const dy = this.dragger.getDeltaYToStartPoint( point )


		const { isVertical, isHorizontal } = this.line
		const { startSegment: startSegment } = this.orthogonalLine

		if ( isVertical || isHorizontal) {
			if ( ! this.shouldAddCornerSegmentWhenMoving ) {
				this.shouldAddCornerSegmentWhenMoving = true

				this.orthogonalLine.addCornerSegmentsStart( startSegment.point )
				const firstCorner: CornerSegment = firstElement( this.orthogonalLine.cornerSegments )

				this.line.source = firstCorner

				this.tmpStartLine = this.orthogonalLine.addTmpStartLine( { sourceSegment: startSegment, targetSegment: firstCorner } )
			}

			this.tmpStartLine && this.tmpStartLine.updateCenterSegmentPosition()
		}

	}

	handleStopDrag() {
		super.handleStopDrag && super.handleStopDrag()
		this.shouldAddCornerSegmentWhenMoving = false

		this._removeTmpStartLine()

		this.orthogonalLine.refresh()
	}
}
