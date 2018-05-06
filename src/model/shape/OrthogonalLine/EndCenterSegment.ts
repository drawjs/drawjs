import Segment from "../../Segment"
import OrthogonalLine from './OrthogonalLine';
import CommonCenterSegment from './CommonCenterSegment';
import EndLine from './EndLine';
import { notNil } from '../../../util/lodash/index';
import CornerSegment from './CornerSegment';
import { lastElement } from '../../../util/js/array';

export default class EndCenterSegment extends CommonCenterSegment {
	tmpEndLine: EndLine = null

	shouldAddCornerSegmentWhenMoving: boolean = false

	constructor( props ) {
		super( props )

	}

	_removeTmpEndLine() {
		if ( notNil( this.tmpEndLine ) ) {
			this.actions.REMOVE_ELEMENT( this.tmpEndLine.centerSegment )
			this.actions.REMOVE_ELEMENT( this.tmpEndLine )
			this.tmpEndLine = null
		}
	}

	_updateTmpEndLineCenterSegmentsPosition() {
		this.tmpEndLine.updateCenterSegmentPosition()
	}


	handleAfterDragging( event ) {
		super.handleAfterDragging && super.handleAfterDragging( event )

		const point: Point2DInitial = this.getters.getInitialPoint( event )

		const dx = this.dragger.getDeltaXToStartPoint( point )
		const dy = this.dragger.getDeltaYToStartPoint( point )


		const { isVertical, isHorizontal } = this.line
		const { endSegment: endSegment } = this.orthogonalLine

		if ( isVertical || isHorizontal) {
			if ( ! this.shouldAddCornerSegmentWhenMoving ) {
				this.shouldAddCornerSegmentWhenMoving = true

				this.orthogonalLine.addCornerSegmentsEnd( endSegment.point )
				const lastCorner: CornerSegment = lastElement( this.orthogonalLine.cornerSegments )

				this.line.target = lastCorner

				this.tmpEndLine = this.orthogonalLine.addTmpEndLine( { sourceSegment: lastCorner, targetSegment: endSegment } )
			}

			this.tmpEndLine && this.tmpEndLine.updateCenterSegmentPosition()
		}

	}

	handleStopDrag() {
		super.handleStopDrag && super.handleStopDrag()
		this.shouldAddCornerSegmentWhenMoving = false

		this._removeTmpEndLine()

		this.orthogonalLine.refresh()
	}
}
