import Segment from "../../Segment"
import OrthogonalLine from './OrthogonalLine';

export default class CenterSegment extends Segment {
	orthogonalLine: OrthogonalLine

	constructor( props ) {
		super( props )
		this.orthogonalLine = props.orthogonalLine
	}
}
