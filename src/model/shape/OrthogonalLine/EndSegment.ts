import Segment from "../../Segment"
// import OrthogonalLine from './OrthogonalLine';

export default class EndSegment extends Segment {
	orthogonalLine: any

	constructor( props ) {
		super( props )

		this.orthogonalLine = props.orthogonalLine
	}
}
