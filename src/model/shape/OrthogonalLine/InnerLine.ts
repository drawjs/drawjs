import Line from "../Line"
import OrthogonalLine from "./OrthogonalLine"

export default class InnerLine extends Line {
	orthogonalLine: OrthogonalLine

	constructor( props ) {
		super( props )

		this.orthogonalLine = props.orthogonalLine
	}
}
