import Particle from "./Particle"
import Handle from "./Handle"
import Segment from "./Segment"
import bezierCurve from "../util/geometry/bezierCurve"
import MathPoint from "util/math/MathPoint"
import MathVector from "util/math/MathVector"
import Path from "./Path"
import getBizerCurveBounds from "../util/geometry/checkBezierCurveBounds"
import rotate from "../util/geometry/rotate"
import origin from "../util/geometry/origin";

const { PI } = Math

export default class Curve extends Particle {
	segment1: Segment

	segment2: Segment

	handle1: Handle

	handle2: Handle

	path: Path

	constructor( props ) {
		super( props )

		const self = this

		this.segment1 = props.segment1
		this.segment2 = props.segment2

		this.handle1 = this.segment1.handleOut
		this.handle2 = this.segment2.handleIn

		this.path = props.path
	}

	get point1(): Point2D {
		return this.segment1.point
	}

	get point2(): Point2D {
		return this.segment2.point
	}

	get handle1Point(): Point2D {
		return this.handle1.point
	}

	get handle2Point(): Point2D {
		return this.handle2.point
	}

	get prevSegment(): Segment {
		return this.segment1.previous
	}

	get nextSegment(): Segment {
		return this.segment2.next
	}

	get prevPoint(): Point2D {
		return this.prevSegment.point
	}

	get nextPoint(): Point2D {
		return this.nextSegment.point
	}

	get path2d(): Path2D {
		let path2d = new Path2D()

		const { handle1Point, handle2Point, point1, point2 } = this
		const { t } = this.path

		bezierCurve( [ point1, handle1Point, handle2Point, point2 ], t, path2d )

		return path2d
	}

	/**
	 * Real-time and absolute bounds(with no rotation)
	 */
	get bounds(): Bounds {
		const { handle1Point, handle2Point, point1, point2 } = this
		const res: Bounds = getBizerCurveBounds(
			point1,
			handle1Point,
			handle2Point,
			point2
		)
		return res
	}

	get boundsCenter(): Point2D {
		const res: Point2D = this.sharedGetters.getBoundsCenter( this.bounds )
		return res
	}

	render() {
		const { ctx } = this.getters
		ctx.save()
		ctx.lineWidth = 1
		ctx.strokeStyle = "#00f0ff"
		ctx.stroke( this.path2d )
		ctx.restore()
	}
}
