import Segment from "../../Segment"
import StartLine from "./StartLine"
import { notNil } from "../../../util/lodash/index"
import {
	firstElement,
	isFirst,
	isLast,
	findArrayFirstIndex
} from "../../../util/js/array"
import CommonStartEndSegment from "./CommonStartEndSegment"
import CornerSegment from "./CornerSegment"
import distance from "../../../util/geometry/distance"
import OrthogonalLine from "./OrthogonalLine"
import CommonLine from "./CommonLine"

export default class StartSegment extends CommonStartEndSegment {
	constructor( props ) {
		super( props )
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
		const { point } = this

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

			this.translateToPoint( corner.point )

			if ( notNil( index ) ) {
				console.log( index )
				const removingCorners = cornerSegments.filter(
					( element, theIndex ) => theIndex <= index
				)

				this.orthogonalLine.removeCornerSegments( removingCorners )
			}
		}
	}

	translateToPoint( point: Point2D ) {
		this.translateToPointWith( point, this.startLine, <CornerSegment>this.firstCornerSegment, this.orthogonalLine.getNextLine.bind(this.orthogonalLine) )
	}

	handleStopDrag( event ) {
		const cornerSegmentToBeCombined = this._getCornerSegmentToBeCombined()

		if ( notNil( cornerSegmentToBeCombined ) ) {
			this._combineCornerSegment( cornerSegmentToBeCombined )
			this.orthogonalLine.refresh()
		}

		this.orthogonalLine.handleStartSegmentStopDrag( event )

		super.handleStopDrag && super.handleStopDrag()
	}
}
