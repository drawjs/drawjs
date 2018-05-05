import OrthogonalLine from "./OrthogonalLine"
import CommonLine from './CommonLine';

export default class StartLine extends CommonLine {

	constructor( props ) {
		super( props )

		this.centerSegment = this.orthogonalLine.createStartCenterSegment( {
			...this.center,
			line: this
		} )
	}
}
