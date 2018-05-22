import OrthogonalLine from "./OrthogonalLine"
import CommonLine from "./CommonLine"

export default class StartLine extends CommonLine {
	constructor( props ) {
		super( props )

		if ( !this.orthogonalLine.isSimpleLine ) {
			this.centerSegment = this.orthogonalLine.createStartCenterSegment( {
				...this.center,
				line: this
			} )
		}
	}
}
