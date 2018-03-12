import Particle from './Particle';
import Handle from './Handle';
import Segment from './Segment'

export default class Curve extends Particle {
	segment1: Segment

	segment2: Segment

	handle1: Handle

	handle2: Handle

	constructor( props ) {
		super( props )
	}

	get point1(): Point2D {
		return this.segment1.point
	}

	get point2(): Point2D {
		return this.segment2.point
	}
}
