import OrthogonalLine from "./OrthogonalLine"
import CommonLine from './CommonLine';

export default class EndLine extends CommonLine {
	constructor( props ) {
		super( props )

		if ( !this.orthogonalLine.isSimpleLine ) {
			this.centerSegment = this.orthogonalLine.createEndCenterSegment( {
				...this.center,
				line: this
			} )
		}
	}
}
