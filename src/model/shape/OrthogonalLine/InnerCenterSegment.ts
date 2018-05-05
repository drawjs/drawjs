import Segment from "../../Segment"
import OrthogonalLine from './OrthogonalLine';
import CommonCenterSegment from './CommonCenterSegment';

export default class InnerCenterSegment extends CommonCenterSegment {
	orthogonalLine: OrthogonalLine

	constructor( props ) {
		super( props )
		this.orthogonalLine = props.orthogonalLine
	}
}
