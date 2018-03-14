import Graph from "../Graph"
import rotatePoints from "util/geometry/rotatePoints"
import Particle from "../Particle"
import Path from "../Path"
import Item from "../Item"
import connectPoints from "../../util/geometry/connectPoints"
import rotate from "../../util/geometry/rotate"
import connectPolygonPoints from "util/canvas/connectPolygonPoints"

const { max, min, PI } = Math

export default class SizeContainer extends Particle {
	target: Item

	constructor( props ) {
		super( props )

		this.target = props.target
	}

	get initialBounds(): Bounds {
		return this.target.initialBounds
	}

	get angle(): number {
		return this.target.angle
	}

	get radian(): number {
		return this.angle * PI / 180
	}

	get initialBoundsCenter(): Point2D {
		return this.target.initialBoundsCenter
	}

	get path2d(): Path2D {
		const { left, right, top, bottom } = this.initialBounds
		const { radian, initialBoundsCenter } = this

		const point1: Point2D = {
			x: left,
			y: top
		}
		const point2: Point2D = {
			x: right,
			y: top
		}
		const point3: Point2D = {
			x: right,
			y: bottom
		}
		const point4: Point2D = {
			x: left,
			y: bottom
		}

		const rotated1: Point2D = rotate( point1, radian, initialBoundsCenter )
		const rotated2: Point2D = rotate( point2, radian, initialBoundsCenter )
		const rotated3: Point2D = rotate( point3, radian, initialBoundsCenter )
		const rotated4: Point2D = rotate( point4, radian, initialBoundsCenter )

		let path: Path2D = new Path2D()

		path = connectPolygonPoints( [ rotated1, rotated2, rotated3, rotated4 ] )

		return path
	}

	render() {
		const { ctx } = this.getters
		ctx.save()

		ctx.stroke( this.path2d )

		ctx.restore()
	}
}
