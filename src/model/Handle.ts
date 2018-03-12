import Particle from "./Particle";
import isNotNil from "../util/index";

export default class Handle extends Particle {
	point: Point2D

	segment: Segment

	partner: Handle = null

	constructor( props ) {
		super( props )

		this.point = props.point

		this.segment = props.segment

		if ( isNotNil( props.partner ) ) {
			this.partner = props.partner
		}


	}
}
