import Graph from "model/Graph"
import pointInPolygon from "util/geometry/pointInPolygon"
import RectContainer from "model/tool/RectContainer"
import translatePoints from "util/geometry/translatePoints"
import rotatePoints from "util/geometry/rotatePoints"

export default class Polygon extends Graph {

	points: Point2D[] = []

	get rectContainer(): RectContainer {
		const res: RectContainer = new RectContainer( this.points )
		return res
	}

	get path(): Path2D {
		let path: Path2D = new Path2D()

		this.points.map( connect )

		return path

		function connect( point: Point2D, index: number, points: Point2D[] ) {
			const { length }: Point2D[] = points

			if ( index === 0 ) {
				path.moveTo( point.x, point.y )
			}
			if ( index !== 0 ) {
				path.lineTo( point.x, point.y )
			}
			if ( index === length - 1 ) {
				const firstPoints: Point2D = points[ 0 ]
				path.lineTo( firstPoints.x, firstPoints.y )
			}
		}
	}

	constructor( props ) {
		super( props )

		this.points = props.points

		this.rotate()
	}

	translate( x: number, y: number ) {
		this.points = translatePoints( this.points, x, y )
	}
	rotate() {
		const self = this

		this.points = rotatePoints( this.points, this.radianAngle, this.rectContainer.center )

		function reset() {
			self.points = rotatePoints( self.points, 0, self.rectContainer.center )
		}
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

	// ******* Drag ******
	public _updateDrag( event ) {
		const { x, y } = event
		const { x: prevX, y: prevY } = this._prevDraggingPoint
		const deltaX = x - prevX
		const deltaY = y - prevY

		this.translate( deltaX, deltaY )

		this._updatePrevDraggingPoint( event )

		this.draw.render()
	}
	// ******* Drag ******
}
