import Segment from '../../Segment';
import OrthogonalLine from './OrthogonalLine';

export default class CommonSegment extends Segment {
	orthogonalLine: OrthogonalLine

	constructor( props ) {
		super( props )

		this.orthogonalLine = props.orthogonalLine
	}

	handleAfterDragging() {
		this.orthogonalLine.updateCenterSegmentsPosition()

		super.handleAfterDragging && super.handleAfterDragging()
	}
}
