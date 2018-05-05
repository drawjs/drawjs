import Segment from "../../Segment"
import OrthogonalLine from './OrthogonalLine';
import CommonCenterSegment from './CommonCenterSegment';

export default class StartCenterSegment extends CommonCenterSegment {
	orthogonalLine: OrthogonalLine

	constructor( props ) {
		super( props )
		this.orthogonalLine = props.orthogonalLine
	}
}
