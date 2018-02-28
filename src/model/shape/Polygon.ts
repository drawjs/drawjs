import Graph from "../Graph"

export default class Polygon extends Graph {
	coordinates: Point2D[]

	get path(): Path2D {
		let path: Path2D = new Path2D()

		this.coordinates.map( connect )

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
	}

	render() {
		const ctx = this.draw.ctx
		super.render()

		ctx.save()
		ctx.fillStyle = this.fill
		ctx.fill( this.path )
		ctx.restore()
	}
	containPoint() {}
}
