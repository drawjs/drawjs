import Segment from "../../Segment"
import EndLine from "./EndLine"
import { notNil } from "../../../util/lodash/index"
import {
	lastElement,
	isFirst,
	findArrayFirstIndex
} from "../../../util/js/array"
import CornerSegment from "./CornerSegment"
import distance from "../../../util/geometry/distance"
import OrthogonalLine from "./OrthogonalLine"
import CommonStartEndLinking from "./CommonStartEndLinking"

export default class EndLinking extends CommonStartEndLinking {
	constructor( props ) {
		super( setPropsDangerously( props ) )

		function setPropsDangerously( props ) {
			props.segmentFillColor = 'blue'
			return props
		}
	}

	get endLine(): EndLine {
		return this.orthogonalLine.endLine
	}

	get lastCornerSegment(): Segment {
		return lastElement( this.orthogonalLine.cornerSegments )
	}

	_getCornerSegmentToBeCombined(): CornerSegment {
		const possibleCorners = this.orthogonalLine.cornerSegments.filter(
			possible
		)
		const { length } = possibleCorners
		const { point } = this.segment

		for ( let i = 0; i < length; i++ ) {
			const corner = possibleCorners[ i ]
			const { point: cornerPoint } = corner
			const dis = distance( point, cornerPoint )

			if ( dis <= OrthogonalLine.COMBINE_INTERVAL ) {
				return corner
			}
		}

		return null

		function possible(
			corner: CornerSegment,
			index: number,
			array: CornerSegment[]
		) {
			return !isFirst( index )
		}
	}

	_combineCornerSegment( corner: CornerSegment ) {
		const self = this
		if ( notNil( corner ) ) {
			const { cornerSegments } = this.orthogonalLine
			const index = findArrayFirstIndex( cornerSegments, corner )

			this.translateLinkingToPoint( corner.point )
			this.segment.translateToPoint( corner.point )

			if ( notNil( index ) ) {
				const removingCorners = cornerSegments.filter(
					( element, theIndex ) => theIndex >= index
				)

				this.orthogonalLine.removeCornerSegments( removingCorners )
			}
		}
	}

	translateLinkingToPoint( point: Point2D ) {
		this.translateLinkingToPointWith( point, this.endLine, <CornerSegment>this.lastCornerSegment, this.orthogonalLine.getPrevLine.bind(this.orthogonalLine) )
	}

	handleSegmentStopDrag( event ) {
		const cornerSegmentToBeCombined = this._getCornerSegmentToBeCombined()

		if ( notNil( cornerSegmentToBeCombined ) ) {
			this._combineCornerSegment( cornerSegmentToBeCombined )
			this.orthogonalLine.refresh()
		}

		this.orthogonalLine.handleEndSegmentStopDrag( event )

		super.handleStopDrag && super.handleStopDrag()
	}

}
