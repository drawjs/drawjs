import Graph from "../Graph"
import pointInPolygon from "util/geometry/pointInPolygon"

export default class Polygon extends Graph {
	points: Point2D[] = []

	get path(): Path2D {
		let path: Path2D = new Path2D()

		this.points.map( connect )

		return path

		function connect( point: Point2D, index: number ) {
			if ( index === 0 ) {
				path.moveTo( point.x, point.y )
			}
			if ( index !== 0 ) {
				path.lineTo( point.x, point.y )
			}
		}
	}

	constructor( props ) {
		super( props )

		this.points = props.points
	}

	render() {
		const ctx = this.draw.ctx
		super.render()

		ctx.save()
		ctx.fillStyle = this.fill
		ctx.fill( this.path )
		ctx.restore()
	}
	containPoint( x: number, y: number ) {
		const res: boolean = this.draw.ctx.isPointInPath( this.path, x, y )

		return pointInPolygon( { x, y }, this.points )
	}
}
