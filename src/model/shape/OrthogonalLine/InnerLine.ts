import CommonLine from './CommonLine';

export default class InnerLine extends CommonLine {
	constructor( props ) {
		super( props )

		this.centerSegment = this.orthogonalLine.createEndInnerCenterSegment( {
			...this.center,
			line: this
		} )
	}
}
