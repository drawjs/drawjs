import Graph from "../Graph"
import rotatePoints from "util/geometry/rotatePoints"
import Particle from "../Particle"
import Path from '../Path';
import Item from "../Item"
import connectPoints from "../../util/geometry/connectPoints"
import rotate from "../../util/geometry/rotate"
import connectPolygonPoints from "util/canvas/connectPolygonPoints"

const { max, min, PI } = Math

export default class BoundsContainer extends Particle {
	target: Path

	constructor( props ) {
		super( props )

		this.target = props.target
	}

	get bounds(): Bounds {
		return this.target.bounds
	}

	get angle(): number {
		return this.target.angle
	}

	get radian(): number {
		return this.angle * PI / 180
	}

	get path2d(): Path2D {
		const { left, right, top, bottom } = this.bounds
		const { radian } = this

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

		let path: Path2D = new Path2D()

		path = connectPolygonPoints( [ point1, point2, point3, point4 ] )

		return path
	}

	render() {
		const { ctx } = this.getters
		ctx.save()

		ctx.stroke( this.path2d )

		ctx.restore()
	}
}
