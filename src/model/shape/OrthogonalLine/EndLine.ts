import OrthogonalLine from "./OrthogonalLine"
import CommonLine from './CommonLine';

export default class EndLine extends CommonLine {
	constructor( props ) {
		super( props )

		this.centerSegment = this.orthogonalLine.createEndCenterSegment( {
			...this.center,
			line: this
		} )
	}
}
