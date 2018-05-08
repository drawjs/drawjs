import Segment from "../../Segment"
import StartLine from "./StartLine"
import { notNil } from "../../../util/lodash/index"
import {
	firstElement,
	isFirst,
	isLast,
	findArrayFirstIndex
} from "../../../util/js/array"
import CommonSegment from "./CommonSegment"
import CornerSegment from "./CornerSegment"
import distance from "../../../util/geometry/distance"
import OrthogonalLine from "./OrthogonalLine"

export default class StartSegment extends CommonSegment {
	prevStartLineHorizontal: boolean = false
	prevStartLineVertical: boolean = false

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
		const possibleCorners = this.orthogonalLine.cornerSegments.filter( possible )
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

	_setPrevStartLineHorizontal( value: boolean ) {
		this.prevStartLineHorizontal = value
	}

	_setPrevStartLineVertical( value: boolean ) {
		this.prevStartLineVertical = value
	}

	_combineCornerSegment( corner: CornerSegment ) {
		const self = this
		if ( notNil( corner ) ) {
			const { cornerSegments } = this.orthogonalLine
			const index = findArrayFirstIndex( cornerSegments, corner )

			this.translateToPoint( corner.point )

			if ( notNil( index ) ) {
				console.log( index )
				const removingCorners = cornerSegments
					.filter( ( element, theIndex ) => theIndex <= index )

				this.orthogonalLine.removeCornerSegments( removingCorners )
			}
		}

	}

	handleStartDrag() {
		this._setPrevStartLineHorizontal( this.startLine.isHorizontal )
		this._setPrevStartLineVertical( this.startLine.isVertical )
	}

	handleDragging() {
		/**
		 * Update the position of first corner segment
		 */
		const { firstCornerSegment } = this
		if ( notNil( firstCornerSegment ) ) {
			this.prevStartLineVertical &&
				this.sharedActions.updateSegmentX( firstCornerSegment, this.x )
			this.prevStartLineHorizontal &&
				this.sharedActions.updateSegmentY( firstCornerSegment, this.y )
		}
	}

	handleStopDrag() {
		const cornerSegmentToBeCombined = this._getCornerSegmentToBeCombined()

		if ( notNil( cornerSegmentToBeCombined ) ) {
			this._combineCornerSegment( cornerSegmentToBeCombined )
			this.orthogonalLine.refresh()
		}

		super.handleStopDrag && super.handleStopDrag()
	}
}
