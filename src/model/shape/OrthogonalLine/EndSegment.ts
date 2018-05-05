import Segment from "../../Segment"
import EndLine from './EndLine';
import { notNil } from '../../../util/lodash/index';
import { lastElement } from '../../../util/js/array';
import CommonSegment from './CommonSegment';

export default class EndSegment extends CommonSegment {

	prevEndLineHorizontal: boolean = false
	prevEndLineVertical: boolean = false

	constructor( props ) {
		super( props )
	}

	get endLine(): EndLine {
		return this.orthogonalLine.endLine
	}

	get lastCornerSegment(): Segment {
		return lastElement( this.orthogonalLine.cornerSegments )
	}

	_setPrevEndLineHorizontal( value: boolean ) {
		this.prevEndLineHorizontal = value
	}

	_setPrevEndLineVertical( value: boolean ) {
		this.prevEndLineVertical = value
	}

	handleStartDrag() {
		this._setPrevEndLineHorizontal( this.endLine.isHorizontal )
		this._setPrevEndLineVertical( this.endLine.isVertical )
	}

	handleDragging() {
		/**
		 * Update the position of first corner segment
		 */
		const {  lastCornerSegment } = this
		if ( notNil( lastCornerSegment ) ) {
			this.prevEndLineVertical &&
				this.sharedActions.updateSegmentX( lastCornerSegment, this.x )
			this.prevEndLineHorizontal &&
				this.sharedActions.updateSegmentY( lastCornerSegment, this.y )
		}
	}
}
