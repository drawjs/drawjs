import Segment from "../../Segment"
import StartLine from "./StartLine"
import { notNil } from "../../../util/lodash/index"
import { firstElement } from '../../../util/js/array';
import CommonSegment from './CommonSegment';

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

	_setPrevStartLineHorizontal( value: boolean ) {
		this.prevStartLineHorizontal = value
	}

	_setPrevStartLineVertical( value: boolean ) {
		this.prevStartLineVertical = value
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
}
