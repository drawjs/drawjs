import Segment from "../../Segment"
import OrthogonalLine from "./OrthogonalLine"

export default class CornerSegment extends Segment {
	orthogonalLine: OrthogonalLine

	constructor( props ) {
		super( props )

		this.orthogonalLine = props.orthogonalLine
	}
}
