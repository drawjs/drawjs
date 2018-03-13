import Particle from "./Particle"
import Handle from "./Handle"
import Segment from "./Segment"
import bezierCurve from "../util/geometry/bezierCurve"
import MathPoint from "./math/MathPoint"
import MathVector from "./math/MathVector"

export default class Curve extends Particle {
	segment1: Segment

	segment2: Segment

	handle1: Handle

	handle2: Handle

	constructor( props ) {
		super( props )

		const self = this

		this.segment1 = props.segment1
		this.segment2 = props.segment2

		this.handle1 = this.segment1.handleOut
		this.handle2 = this.segment2.handleIn

		const newHandle1Point = getNewHandle1Point()
		const newHandle2Point = getNewHandle2Point()

		this.sharedActions.updateHandlePoint( this.handle1, newHandle1Point )
		this.sharedActions.adjustHandleParterPoint( this.handle1 )
		// this.sharedActions.updateHandlePoint( this.handle2, newHandle2Point )
		// this.sharedActions.adjustHandleParterPoint( this.handle2 )

		function getNewHandle1Point(): Point2D {
			const A: MathPoint = new MathPoint(
				self.prevPoint.x + self.point1.x / 2,
				( self.prevPoint.y + self.point1.y ) / 2
			)
			const B: MathPoint = new MathPoint( self.point2.x, self.point2.y )
			const AB: MathVector = new MathVector( A, B )
			const AH: MathVector = AB.rotate( 90 )
			const res: Point2D = {
				x: AH.x + A.x,
				y: AH.y + A.y
			}
			return res
		}

		// function getNewHandle2Point() {
		// 	const A: MathPoint = new MathPoint(
		// 		self.prevPoint.x + self.point1.x / 2,
		// 		( self.prevPoint.y + self.point1.y ) / 2
		// 	)
		// 	const B: MathPoint = new MathPoint( self.point2.x, self.point2.y )
		// 	const AB: MathVector = new MathVector( A, B )
		// 	const AH: MathVector = AB.rotate( -90 )
		// 	const res: Point2D = {
		// 		x: AH.x + A.x,
		// 		y: AH.y + A.y
		// 	}
		// 	return res
		// }
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

	get path(): Path2D {
		let path = new Path2D()

		const { handle1Point, handle2Point, point1, point2 } = this

		path = bezierCurve( [ point1, handle1Point, handle2Point, point2 ] )

		// path = bezierCurve(  )

		return path
	}

	contain( x: number, y: number ) {}

	render() {
		const { ctx } = this.getters
		ctx.save()
		ctx.strokeStyle = "blue"
		ctx.stroke( this.path )
		ctx.restore()
	}
}
