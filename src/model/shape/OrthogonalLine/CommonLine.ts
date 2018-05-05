import Line from '../Line';
import OrthogonalLine from './OrthogonalLine';

export default class CommonLine extends Line {
	orthogonalLine: OrthogonalLine

	centerSegment: any = null

	constructor( props ) {
		super( props )

		this.orthogonalLine = props.orthogonalLine
	}

	updateCenterSegmentPosition() {
		this.sharedActions.updateSegmentPoint(
			this.centerSegment, this.center
		)
	}
}
