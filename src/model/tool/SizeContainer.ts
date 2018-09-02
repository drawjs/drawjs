import Graph from "../Graph"
import rotatePoints from "../../util/geometry/rotatePoints"
import Particle from "../Particle"
import Path from "../Path"
import Item from "../Item"
import connectPoints from "../../util/geometry/connectPoints"
import rotate from "../../util/geometry/rotate"
import connectPolygonPoints from "../../util/canvas/connectPolygonPoints"

const { max, min, PI } = Math

export default class SizeContainer extends Particle {
	target: Item

	constructor( props ) {
		super( props )

		this.target = props.target
	}

	get targetSizable(): boolean {
		return this.target && this.target.sizable
	}

	get radian(): number {
		return this.target.radian
	}

	get container(): Container {
		return this.target.itemContainer
	}

	get path2d(): Path2D {
		const { leftTop, rightTop, rightBottom, leftBottom } = this.container
		let path: Path2D = new Path2D()
		path = connectPolygonPoints( [
			leftTop,
			rightTop,
			rightBottom,
			leftBottom
		] )

		return path
	}

	render() {
		if ( this.targetSizable ) {
			const { ctx } = this.getters
			ctx.save()

			ctx.lineWidth = 1
			ctx.strokeStyle = "blue"
			ctx.stroke( this.path2d )

			ctx.restore()
		}
	}
}
