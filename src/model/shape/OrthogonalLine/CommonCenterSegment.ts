import Segment from "../../Segment"
import OrthogonalLine from './OrthogonalLine';
import { getPropsAddedFillColor } from "../../../drawUtil/index";

export default class CommonCenterSegment extends Segment {
	orthogonalLine: OrthogonalLine
	line: any = null

	constructor( props ) {
		super( getPropsAddedFillColor( props, 'deepSkyBlue' ) )
		this.orthogonalLine = props.orthogonalLine

		this.line = props.line
	}
}
