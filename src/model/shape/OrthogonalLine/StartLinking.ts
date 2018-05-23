import Segment from "../../Segment"
import StartLine from "./StartLine"
import { notNil } from "../../../util/lodash/index"
import {
	firstElement,
	isFirst,
	isLast,
	findArrayFirstIndex
} from "../../../util/js/array"
import CornerSegment from "./CornerSegment"
import distance from "../../../util/geometry/distance"
import OrthogonalLine from "./OrthogonalLine"
import CommonLine from "./CommonLine"
import CommonStartEndLinking from "./CommonStartEndLinking"

export default class StartLinking extends CommonStartEndLinking {
	constructor( props ) {
		super( setPropsDangerously( props ) )
		function setPropsDangerously( props ) {
			props.segmentFillColor = "red"
			return props
		}
	}

	get startLine(): StartLine {
		return this.orthogonalLine.startLine
	}

	get firstCornerSegment(): Segment {
		return firstElement( this.orthogonalLine.cornerSegments )
	}

	_getCornerSegmentToBeCombined(): CornerSegment {
		const possibleCorners = this.orthogonalLine.cornerSegments.filter(
			possible
		)
		const { length } = possibleCorners
		const { point } = this.segment

		let res = null

		for ( let i = 0; i < length; i++ ) {
			const corner = possibleCorners[ i ]
			const { point: cornerPoint } = corner
			const dis = distance( point, cornerPoint )

			if ( dis <= OrthogonalLine.COMBINE_INTERVAL ) {
				res = corner
			}
		}

		return res

		function possible(
			corner: CornerSegment,
			index: number,
			array: CornerSegment[]
		) {
			return !isLast( index, array )
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
					( element, theIndex ) => theIndex <= index
				)

				this.orthogonalLine.removeCornerSegments( removingCorners )
			}
		}
	}

	translateLinkingToPoint( point: Point2D ) {
		this.translateLinkingToPointWith(
			point,
			this.startLine,
			<CornerSegment>this.firstCornerSegment,
			this.orthogonalLine.getNextLine.bind( this.orthogonalLine )
		)
	}

	handleSegmentStopDrag( event ) {
		if ( this.segment.draggable ) {
			const cornerSegmentToBeCombined = this._getCornerSegmentToBeCombined()

			if ( notNil( cornerSegmentToBeCombined ) ) {
				this._combineCornerSegment( cornerSegmentToBeCombined )
				this.orthogonalLine.refresh()
			}

			this.orthogonalLine.handleStartSegmentStopDrag( event )
		}
	}
}
